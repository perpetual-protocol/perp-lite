// make these two vars into a object and remove layer1 & layer2 on naming
export const ambABI = {
    eth: [
        "event RelayedMessage(address indexed sender, address indexed executor, bytes32 indexed messageId, bool status)",
        "event AffirmationCompleted( address indexed sender, address indexed executor, bytes32 indexed messageId, bool status)",
    ],
    xdai: [
        "event AffirmationCompleted( address indexed sender, address indexed executor, bytes32 indexed messageId, bool status)",
    ],
}

export const permittableTokenABI = ["function nonces(address _owner) view returns (uint256 balance)"]
