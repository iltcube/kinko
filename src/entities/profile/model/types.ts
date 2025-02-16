export interface ServiceCredentials {
  id: UUIDv7
  serviceName: string
  login: string
  password: string
  url?: string
  notes?: string
  updatedAt: DateUTC
  createdAt: DateUTC
}

export interface EncryptedServiceCredentials {
  id: UUIDv7
  encryptedData: string
  updatedAt: DateUTC
  createdAt: DateUTC
}

export interface Profile {
  hashedPassword: string
  salt: string
  encryptedSeed: string
  credentials: Array<EncryptedServiceCredentials>
  created: DateUTC
}
