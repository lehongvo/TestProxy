// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

interface ILocker {
    // condittion to transfer
    function isTokenLocked(uint256 _tokenId) external view returns (bool);
    function isValidTransfer(address _from, address _to) external view returns (bool);

    function setContractAddress(address _contractAddress) external;
    function lockTokenIds(uint256[] memory _tokenId, uint256 duration) external;
    function lockTokenIds(uint256[] memory _tokenIds) external;

    function unlockToken(uint256[] memory _tokenIds) external;
    function setLockSystem(bool _isLock) external;

}
