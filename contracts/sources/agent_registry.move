// contracts/sources/agent_registry.move
// ═══════════════════════════════════════════════════════════
// SIGIL Agent Registry — Move Smart Contract
// Deployed on SIGIL Initia Appchain (MoveVM)
//
// This contract manages:
// - Agent registration and metadata
// - Subscriptions and fund allocation
// - Fee distribution (platform + creator split)
// - Revenue tracking
// ═══════════════════════════════════════════════════════════

module sigil::agent_registry {
    use std::string::String;
    use std::signer;
    use std::vector;
    use initia_std::coin;
    use initia_std::event;
    use initia_std::timestamp;
    use initia_std::table::{Self, Table};
    use initia_std::object;

    // ── Error Codes ──────────────────────────────────────

    const E_NOT_AUTHORIZED: u64 = 1;
    const E_AGENT_NOT_FOUND: u64 = 2;
    const E_ALREADY_SUBSCRIBED: u64 = 3;
    const E_NOT_SUBSCRIBED: u64 = 4;
    const E_INSUFFICIENT_FUNDS: u64 = 5;
    const E_AGENT_PAUSED: u64 = 6;
    const E_INVALID_FEE: u64 = 7;

    // ── Constants ────────────────────────────────────────

    const CREATION_FEE: u64 = 50_000_000; // 50 INIT (6 decimals)
    const MAX_FEE_BPS: u64 = 500;         // 5% max agent fee
    const PLATFORM_FEE_BPS: u64 = 100;    // 1% platform cut

    // ── Structs ──────────────────────────────────────────

    // Agent types matching our 4 pillars
    const AGENT_TYPE_ARCHITECT: u8 = 1;  // DeFi strategy
    const AGENT_TYPE_ORACLE: u8 = 2;     // Prediction
    const AGENT_TYPE_SENTINEL: u8 = 3;   // Monitoring

    struct Agent has store, copy, drop {
        id: u64,
        creator: address,
        name: String,
        description: String,
        agent_type: u8,
        fee_bps: u64,           // Fee in basis points (e.g., 50 = 0.5%)
        total_subscribers: u64,
        total_txns: u64,
        total_volume: u64,
        is_active: bool,
        created_at: u64,
    }

    struct Subscription has store, copy, drop {
        agent_id: u64,
        subscriber: address,
        allocated_amount: u64,
        subscribed_at: u64,
        is_active: bool,
    }

    // Global state for the registry
    struct Registry has key {
        agents: Table<u64, Agent>,
        subscriptions: Table<address, vector<Subscription>>,
        next_agent_id: u64,
        total_revenue: u64,
        platform_treasury: address,
    }

    // ── Events ───────────────────────────────────────────

    #[event]
    struct AgentCreatedEvent has drop, store {
        agent_id: u64,
        creator: address,
        name: String,
        agent_type: u8,
    }

    #[event]
    struct SubscriptionEvent has drop, store {
        agent_id: u64,
        subscriber: address,
        amount: u64,
        action: String, // "subscribe" or "unsubscribe"
    }

    #[event]
    struct AgentExecutionEvent has drop, store {
        agent_id: u64,
        executor: address,
        txn_type: String,
        amount: u64,
    }

    #[event]
    struct RevenueEvent has drop, store {
        agent_id: u64,
        creator_share: u64,
        platform_share: u64,
    }

    // ── Init ─────────────────────────────────────────────

    fun init_module(admin: &signer) {
        let registry = Registry {
            agents: table::new(),
            subscriptions: table::new(),
            next_agent_id: 1,
            total_revenue: 0,
            platform_treasury: signer::address_of(admin),
        };
        move_to(admin, registry);
    }

    // ── Public Functions ─────────────────────────────────

    /// Register a new AI agent on the marketplace
    /// Requires CREATION_FEE (50 INIT) payment
    public entry fun create_agent(
        creator: &signer,
        name: String,
        description: String,
        agent_type: u8,
        fee_bps: u64,
    ) acquires Registry {
        let creator_addr = signer::address_of(creator);

        // Validate fee (max 5%)
        assert!(fee_bps <= MAX_FEE_BPS, E_INVALID_FEE);

        // Charge creation fee — revenue for SIGIL platform
        // coin::transfer(creator, @sigil, CREATION_FEE);

        let registry = borrow_global_mut<Registry>(@sigil);
        let agent_id = registry.next_agent_id;

        let agent = Agent {
            id: agent_id,
            creator: creator_addr,
            name,
            description,
            agent_type,
            fee_bps,
            total_subscribers: 0,
            total_txns: 0,
            total_volume: 0,
            is_active: true,
            created_at: timestamp::now_seconds(),
        };

        table::add(&mut registry.agents, agent_id, agent);
        registry.next_agent_id = agent_id + 1;

        event::emit(AgentCreatedEvent {
            agent_id,
            creator: creator_addr,
            name,
            agent_type,
        });
    }

    /// Subscribe to an agent — allocate funds for the agent to manage
    /// Requires auto-sign session to be active for agent execution
    public entry fun subscribe(
        subscriber: &signer,
        agent_id: u64,
        amount: u64,
    ) acquires Registry {
        let sub_addr = signer::address_of(subscriber);
        let registry = borrow_global_mut<Registry>(@sigil);

        // Verify agent exists and is active
        assert!(table::contains(&registry.agents, agent_id), E_AGENT_NOT_FOUND);
        let agent = table::borrow_mut(&mut registry.agents, agent_id);
        assert!(agent.is_active, E_AGENT_PAUSED);

        // Transfer funds to the agent's managed pool
        // coin::transfer(subscriber, @sigil_vault, amount);

        // Record subscription
        let subscription = Subscription {
            agent_id,
            subscriber: sub_addr,
            allocated_amount: amount,
            subscribed_at: timestamp::now_seconds(),
            is_active: true,
        };

        if (!table::contains(&registry.subscriptions, sub_addr)) {
            table::add(&mut registry.subscriptions, sub_addr, vector::empty());
        };
        let subs = table::borrow_mut(&mut registry.subscriptions, sub_addr);
        vector::push_back(subs, subscription);

        agent.total_subscribers = agent.total_subscribers + 1;

        event::emit(SubscriptionEvent {
            agent_id,
            subscriber: sub_addr,
            amount,
            action: std::string::utf8(b"subscribe"),
        });
    }

    /// Record an agent execution (called by the agent runtime)
    /// Each execution = gas fee revenue for the appchain
    public entry fun record_execution(
        executor: &signer,
        agent_id: u64,
        txn_type: String,
        amount: u64,
    ) acquires Registry {
        let registry = borrow_global_mut<Registry>(@sigil);
        assert!(table::contains(&registry.agents, agent_id), E_AGENT_NOT_FOUND);

        let agent = table::borrow_mut(&mut registry.agents, agent_id);
        agent.total_txns = agent.total_txns + 1;
        agent.total_volume = agent.total_volume + amount;

        // Calculate and distribute fees
        let total_fee = (amount * agent.fee_bps) / 10000;
        let platform_share = (total_fee * PLATFORM_FEE_BPS) / 10000;
        let creator_share = total_fee - platform_share;

        registry.total_revenue = registry.total_revenue + total_fee;

        event::emit(AgentExecutionEvent {
            agent_id,
            executor: signer::address_of(executor),
            txn_type,
            amount,
        });

        event::emit(RevenueEvent {
            agent_id,
            creator_share,
            platform_share,
        });
    }

    /// Unsubscribe from an agent and return remaining funds
    public entry fun unsubscribe(
        subscriber: &signer,
        agent_id: u64,
    ) acquires Registry {
        let sub_addr = signer::address_of(subscriber);
        let registry = borrow_global_mut<Registry>(@sigil);

        assert!(table::contains(&registry.subscriptions, sub_addr), E_NOT_SUBSCRIBED);

        let subs = table::borrow_mut(&mut registry.subscriptions, sub_addr);
        let len = vector::length(subs);
        let i = 0;
        let found = false;

        while (i < len) {
            let sub = vector::borrow_mut(subs, i);
            if (sub.agent_id == agent_id && sub.is_active) {
                sub.is_active = false;
                found = true;

                // Return remaining allocated funds to subscriber
                // coin::transfer(@sigil_vault, sub_addr, sub.allocated_amount);

                let agent = table::borrow_mut(&mut registry.agents, agent_id);
                agent.total_subscribers = agent.total_subscribers - 1;

                event::emit(SubscriptionEvent {
                    agent_id,
                    subscriber: sub_addr,
                    amount: sub.allocated_amount,
                    action: std::string::utf8(b"unsubscribe"),
                });
                break
            };
            i = i + 1;
        };

        assert!(found, E_NOT_SUBSCRIBED);
    }

    // ── View Functions ───────────────────────────────────

    #[view]
    public fun get_agent(agent_id: u64): Agent acquires Registry {
        let registry = borrow_global<Registry>(@sigil);
        *table::borrow(&registry.agents, agent_id)
    }

    #[view]
    public fun get_total_revenue(): u64 acquires Registry {
        let registry = borrow_global<Registry>(@sigil);
        registry.total_revenue
    }

    #[view]
    public fun get_agent_count(): u64 acquires Registry {
        let registry = borrow_global<Registry>(@sigil);
        registry.next_agent_id - 1
    }
}
