// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

import "./Utils/OwnerOperator.sol";

abstract contract AllItem is OwnerOperator{

    // tokenId => attributes of tokenId
    mapping(uint256 => uint32[15]) public attributes;

    function updateAttributeByToken (uint256 _tokenId, uint32[15] memory _newAtr) external operatorOrOwner{
        attributes[_tokenId] = _newAtr;
    }

    function assignAttributes(uint32[15] storage dstAttributes, uint32[15] memory srcAttributes) internal operatorOrOwner{
        for(uint i = 0; i < dstAttributes.length; i++) {
            if (dstAttributes[i] != srcAttributes[i])
                dstAttributes[i] = srcAttributes[i];
        }
    }

    function getAttributeByToken (uint256 _tokenId) external view returns(uint32[15] memory) {
        return attributes[_tokenId];
    }

    function getAttributes(uint256[] calldata ids) external view returns(uint32[15][] memory) {
        uint32[15][] memory atts = new uint32[15][](ids.length);
        for(uint i = 0; i < ids.length; i++) {
            atts[i] = attributes[ids[i]];
        }
        return atts;
    }

    function getAttributeOfTokenId(uint256 tokenId) external view returns(uint32[15] memory) {
        return attributes[tokenId];
    }

    function getCategory (uint tokenId) external view returns(uint32) {
        return attributes[tokenId][0];
    }

    function getTypeId(uint tokenId) external view returns(uint32) {
        return attributes[tokenId][1];
    }

    function getTypeItem(uint tokenId) external view returns(uint32) {
        return attributes[tokenId][2];
    }

    function getAirdrop(uint tokenId) external view returns(uint32) {
        return attributes[tokenId][3];
    }

    function getLocked(uint tokenId) external view returns(uint32) {
        return attributes[tokenId][4];
    }

    function getLevel(uint tokenId) external view returns(uint32) {
        return attributes[tokenId][5];
    }

    function getEventLinked(uint tokenId) external view returns(uint32) {
        return attributes[tokenId][6];
    }

    function getStartDate(uint tokenId) external view returns(uint32) {
        return attributes[tokenId][7];
    }

    function getExpirationDate(uint tokenId) external view returns(uint32) {
        return attributes[tokenId][8];
    }

}
