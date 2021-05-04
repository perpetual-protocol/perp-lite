export const layer1AmbAbi = [
    "event RelayedMessage(address indexed sender, address indexed executor, bytes32 indexed messageId, bool status)",
    "event AffirmationCompleted( address indexed sender, address indexed executor, bytes32 indexed messageId, bool status)",
]

export const layer2AmbAbi = [
    "event AffirmationCompleted( address indexed sender, address indexed executor, bytes32 indexed messageId, bool status)",
]

export const permittableTokenAbi = ["function nonces(address _owner) view returns (uint256 balance)"]
