import { 
    PUBLIC_ETHEREUM_CHAIN_ID, 
    PUBLIC_ETHEREUM_ENDPOINT, 
} from '$env/static/public';

export namespace Ethereum {
    export const chainId = PUBLIC_ETHEREUM_CHAIN_ID;
    export const endpoint = PUBLIC_ETHEREUM_ENDPOINT;
}