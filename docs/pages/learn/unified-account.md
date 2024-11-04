# Unified Account

## Consolidating Fragmented Accounts Across Protocols

A Unified Account is designed to consolidate fragmented accounts across multiple blockchain protocols into a single, cohesive structure, allowing users to maintain data sovereignty and interoperability across different blockchains, despite protocol-specific differences.
Unified Accounts provide a Single Origin, Multi-Protocol Representation, allowing accounts that use the same cryptographic algorithms across protocols to be managed as one. By establishing an AccountId and mapping protocol-specific account addresses to this AccountId, Unified Accounts enable a consistent point of access internally, regardless of the protocol in use.

## Resolving Protocol Fragmentation

With the proliferation of blockchains, each chain has begun to establish its own specifications. While some chains share identical cryptographic algorithms, the unique protocol specifications often isolate these accounts. Consequently, users are required to use separate wallets for each blockchain, and they cannot directly control or access the states across different protocols.

Unified Accounts address these issues by:

- Mapping disparate account representations to a single AccountId, thereby enabling a unified management experience.
- Allowing users to access integrated account states across protocols through the AccountId, eliminating fragmentation.

Supporting cross-protocol transactions (Cross-Protocol Transactions) by sharing a single identity across different blockchain protocols, thus enabling seamless transactions across protocol boundaries.

## Unified Account Workflow

1. Inbound Transactions (Before Account Unification): Before accounts are unified, any inbound transactions (e.g., asset transfers) are stored in protocol-specific accounts independently.
2. Outbound Transactions and Account Unification: When the first outbound transaction is initiated (signed by the user), the system verifies the signature, identifies the AccountId, and connects it with all compatible accounts across protocols. At this stage, the system transfers the native asset from the connected account to the AccountId. Since only a native asset can exist before account unification, this process consolidates that asset under the unified account, establishing a consistent, centralized access point across protocols.
3. On-Chain Storage: After the accounts are unified, the mapping between the AccountId and protocol-specific accounts is stored on-chain. Following this, all future inbound and outbound transactions are processed based on the AccountId, allowing the user to maintain a single, unified state across protocols.

This integration enables a Unified Account to provide seamless access and control across protocols, promoting compatibility and efficient management of blockchain assets and data within a single, unified framework.
