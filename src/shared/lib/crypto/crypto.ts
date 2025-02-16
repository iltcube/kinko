import { generateMnemonic, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'
import CryptoJS from 'crypto-js'

const KEY_SIZE_BITS = {
  light: 128,
  standart: 256,
  strong: 512,
  ultra: 1024
} as const

type KeySizeBits = keyof typeof KEY_SIZE_BITS

interface UseCrypto {
  getSalt: () => string
  getHash: (valueToHash: string, salt: string, keySizeBits: KeySizeBits) => string
  encrypt: (valueToEncrypt: string, key: string) => string
  decrypt: (encryptValue: string, key: string) => string
  generateSeeds: () => string
  isSeedsValid: (seeds: string) => boolean
}

const SALT_SIZE_BITS = 128
const BITS_IN_BYTE = 8

const BITS_IN_WORD = 32
const ITERATIONS = 100000

export const useCrypto = (): UseCrypto => {
  const getSalt = (): string =>
    CryptoJS.lib.WordArray.random(SALT_SIZE_BITS / BITS_IN_BYTE).toString()

  const getHash = (valueToHash: string, salt: string, variant: KeySizeBits): string =>
    CryptoJS.PBKDF2(valueToHash, salt, {
      keySize: KEY_SIZE_BITS[variant] / BITS_IN_WORD,
      iterations: ITERATIONS
    }).toString()

  const encrypt = (valueToEncrypt: string, key: string): string =>
    CryptoJS.AES.encrypt(valueToEncrypt, key).toString()

  const decrypt = (encryptValue: string, key: string): string =>
    CryptoJS.AES.decrypt(encryptValue, key).toString(CryptoJS.enc.Utf8)

  const generateSeeds = (): string => generateMnemonic(wordlist)

  const isSeedsValid = (seeds: string): boolean => validateMnemonic(seeds, wordlist)

  return { getSalt, getHash, encrypt, decrypt, generateSeeds, isSeedsValid }
}
