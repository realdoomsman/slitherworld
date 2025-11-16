import { pgTable, uuid, varchar, timestamp, integer, decimal, boolean, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletAddress: varchar('wallet_address', { length: 44 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const matches = pgTable('matches', {
  id: uuid('id').primaryKey().defaultRandom(),
  lobbyType: varchar('lobby_type', { length: 20 }).notNull(),
  entryFee: decimal('entry_fee', { precision: 10, scale: 2 }).notNull(),
  potAmount: decimal('pot_amount', { precision: 10, scale: 2 }).notNull(),
  winnerAddress: varchar('winner_address', { length: 44 }),
  winnerPayout: decimal('winner_payout', { precision: 10, scale: 2 }),
  payoutTxHash: varchar('payout_tx_hash', { length: 88 }),
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at'),
  status: varchar('status', { length: 20 }).notNull().default('waiting'),
})

export const matchPlayers = pgTable('match_players', {
  id: uuid('id').primaryKey().defaultRandom(),
  matchId: uuid('match_id').notNull().references(() => matches.id),
  walletAddress: varchar('wallet_address', { length: 44 }).notNull(),
  entryTxHash: varchar('entry_tx_hash', { length: 88 }).notNull(),
  finalLength: integer('final_length').default(0),
  killCount: integer('kill_count').default(0),
  survivalTime: integer('survival_time').default(0),
  placement: integer('placement'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
})

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletAddress: varchar('wallet_address', { length: 44 }).notNull(),
  txHash: varchar('tx_hash', { length: 88 }).notNull().unique(),
  type: varchar('type', { length: 20 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  matchId: uuid('match_id').references(() => matches.id),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletAddress: varchar('wallet_address', { length: 44 }).notNull().unique(),
  token: varchar('token', { length: 64 }).notNull().unique(),
  challenge: text('challenge').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
