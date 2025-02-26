export const shadowPoolFactoryV3Abi = [
  {
    inputs: [{ internalType: 'address', name: '_accessHub', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'A0', type: 'error' },
  { inputs: [], name: 'F0', type: 'error' },
  { inputs: [], name: 'FTL', type: 'error' },
  { inputs: [], name: 'IT', type: 'error' },
  { inputs: [], name: 'PE', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'pool', type: 'address' },
      { indexed: false, internalType: 'uint24', name: 'newFee', type: 'uint24' },
    ],
    name: 'FeeAdjustment',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'oldFeeCollector', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newFeeCollector', type: 'address' },
    ],
    name: 'FeeCollectorChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'token0', type: 'address' },
      { indexed: true, internalType: 'address', name: 'token1', type: 'address' },
      { indexed: true, internalType: 'uint24', name: 'fee', type: 'uint24' },
      { indexed: false, internalType: 'int24', name: 'tickSpacing', type: 'int24' },
      { indexed: false, internalType: 'address', name: 'pool', type: 'address' },
    ],
    name: 'PoolCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint8', name: 'feeProtocolOld', type: 'uint8' },
      { indexed: false, internalType: 'uint8', name: 'feeProtocolNew', type: 'uint8' },
    ],
    name: 'SetFeeProtocol',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'pool', type: 'address' },
      { indexed: false, internalType: 'uint8', name: 'feeProtocolOld', type: 'uint8' },
      { indexed: false, internalType: 'uint8', name: 'feeProtocolNew', type: 'uint8' },
    ],
    name: 'SetPoolFeeProtocol',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'int24', name: 'tickSpacing', type: 'int24' },
      { indexed: true, internalType: 'uint24', name: 'fee', type: 'uint24' },
    ],
    name: 'TickSpacingEnabled',
    type: 'event',
  },
  {
    inputs: [],
    name: 'accessHub',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenA', type: 'address' },
      { internalType: 'address', name: 'tokenB', type: 'address' },
      { internalType: 'int24', name: 'tickSpacing', type: 'int24' },
      { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
    ],
    name: 'createPool',
    outputs: [{ internalType: 'address', name: 'pool', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'int24', name: 'tickSpacing', type: 'int24' },
      { internalType: 'uint24', name: 'initialFee', type: 'uint24' },
    ],
    name: 'enableTickSpacing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeCollector',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeProtocol',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'pool', type: 'address' }],
    name: 'gaugeFeeSplitEnable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenA', type: 'address' },
      { internalType: 'address', name: 'tokenB', type: 'address' },
      { internalType: 'int24', name: 'tickSpacing', type: 'int24' },
    ],
    name: 'getPool',
    outputs: [{ internalType: 'address', name: 'pool', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_ramsesV3PoolDeployer', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'parameters',
    outputs: [
      { internalType: 'address', name: 'factory', type: 'address' },
      { internalType: 'address', name: 'token0', type: 'address' },
      { internalType: 'address', name: 'token1', type: 'address' },
      { internalType: 'uint24', name: 'fee', type: 'uint24' },
      { internalType: 'int24', name: 'tickSpacing', type: 'int24' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'pool', type: 'address' }],
    name: 'poolFeeProtocol',
    outputs: [{ internalType: 'uint8', name: '__poolFeeProtocol', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ramsesV3PoolDeployer',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_pool', type: 'address' },
      { internalType: 'uint24', name: '_fee', type: 'uint24' },
    ],
    name: 'setFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_feeCollector', type: 'address' }],
    name: 'setFeeCollector',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: '_feeProtocol', type: 'uint8' }],
    name: 'setFeeProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'pool', type: 'address' },
      { internalType: 'uint8', name: '_feeProtocol', type: 'uint8' },
    ],
    name: 'setPoolFeeProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_voter', type: 'address' }],
    name: 'setVoter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'int24', name: 'tickSpacing', type: 'int24' }],
    name: 'tickSpacingInitialFee',
    outputs: [{ internalType: 'uint24', name: 'initialFee', type: 'uint24' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'voter',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
