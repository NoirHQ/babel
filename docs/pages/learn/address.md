# Address
In blockchain, an *address* is a unique identifier assigned to a user’s account or a smart contract. It functions similarly to a bank account number but is specific to blockchain networks, enabling users to send, receive, and hold assets or interact with decentralized applications (DApps). Each blockchain address is typically derived from a *public key*, which itself is generated from a *private key* through cryptographic algorithms.

## Protocol-Specific Address Derivation and Compatibility Issues
While many blockchain protocols use similar digital signature algorithms, they often derive account addresses from public keys in distinct ways. This lack of standardization leads to incompatibility between addresses across protocols. Each protocol may arbitrarily define its own address derivation method, resulting in a technical divergence that implies a greater separation between protocols than actually exists. This incompatibility offers minimal cryptographic benefit but significantly hampers interoperability.

For example, the addresses below were all derived from the same [`secp256k1`](https://en.bitcoin.it/wiki/Secp256k1) public key, yet they differ based on the protocol:

|Protocol|Address|
|---|---|
|Polkadot|5HSVzaktLBoAFZ89RQHEWrJizmSuXrbpGm7favc99p5qt6UM|
|Ethereum|0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac|
|Cosmos|cosmos13essdahf3eajr07lhlpaawswmmfg5pr6t459pg|

All these addresses can be controlled by the single private key. However, due to differences in address formats and the lack of protocol-level compatibility, users often perceive these accounts as distinct, despite their underlying cryptographic equivalence.

## User Experience Challenges and Protocol Fragmentation
Currently, many blockchain protocols prioritize rapid development and expansion to address their unique needs, often with limited consideration for cross-protocol compatibility. As a result, users become accustomed to a specific protocol’s experience and face significant obstacles when trying to interact with other protocols. This friction includes the need to acquire new knowledge, install unfamiliar wallets, and adapt to different application ecosystems, creating a fragmented and complex user experience.

## Babel’s Cross-Protocol Interoperability
Babel addresses this fragmentation by providing mappings between cryptographically equivalent addresses across different protocols. With Babel's address interoperability solution, users can seamlessly interact across heterogeneous blockchain interfaces. For instance, users can transfer assets like Polkadot’s cryptocurrency (DOT) from an Ethereum address to a Cosmos address, bypassing the usual barriers associated with cross-protocol interactions.

