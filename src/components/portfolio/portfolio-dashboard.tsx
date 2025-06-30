'use client'

import { useState, useEffect } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

interface PortfolioData {
  balance: number
  tokens: TokenInfo[]
  totalValue: number
}

interface TokenInfo {
  mint: string
  amount: string
  decimals: number
  symbol?: string
}

export function PortfolioDashboard() {
  const { account, cluster } = useWalletUi()
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    balance: 0,
    tokens: [],
    totalValue: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (account) {
      fetchPortfolioData()
    }
  }, [account]) // Only run when account changes

  const fetchPortfolioData = async () => {
    if (!account) return
    setIsLoading(true)
    try {
      // Replace with real API call in production
      const mockData = {
        balance: 2500000000, // lamports
        tokens: [
          { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', amount: '1000000', decimals: 6, symbol: 'USDC' },
          { mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', amount: '500000000', decimals: 6, symbol: 'USDT' },
        ],
      }
      setPortfolio({
        balance: mockData.balance,
        tokens: mockData.tokens,
        totalValue: calculateTotalValue(mockData.tokens),
      })
      setError('')
    } catch (err) {
      setError('Failed to fetch portfolio data')
    }
    setIsLoading(false)
  }

  const calculateTotalValue = (tokens = portfolio.tokens) => {
    // In production, fetch token prices and calculate USD value
    // Here, just sum token amounts for mock
    return tokens.reduce((total, token) => {
      return total + parseFloat(token.amount) / Math.pow(10, token.decimals)
    }, portfolio.balance / 1_000_000_000) // Add SOL as 1:1 USD for mock
  }

  const formatSol = (lamports: number) => (lamports / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 4 })
  const formatTokenAmount = (amount: string, decimals: number) => (parseFloat(amount) / Math.pow(10, decimals)).toLocaleString(undefined, { maximumFractionDigits: 4 })

  if (!account) {
    return (
      <div className="p-2 flex flex-col items-center justify-center min-h-[60vh]">
        <Image src="/third-time-icon-tiny-white.png" alt="Third Time Logo" width={64} height={64} className="mb-4" />
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-center text-violet-700 drop-shadow-lg">
          Portfolio Dashboard
        </h1>
        <div className="bg-violet-100 p-8 rounded-xl border-4 border-violet-400 shadow-lg">
          <p className="text-2xl font-bold text-violet-800 text-center">
            ⚠️ WALLET CONNECTION REQUIRED<br />Please connect your Solana wallet to view your portfolio
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 md:p-6 max-w-5xl mx-auto overflow-x-hidden">
      <div className="flex items-center gap-4 mb-6">
        <Image src="/third-time-icon-tiny-white.png" alt="Third Time Logo" width={48} height={48} />
        <h1 className="text-3xl md:text-5xl font-extrabold text-violet-700 tracking-tight drop-shadow-lg">
          My Portfolio Dashboard
        </h1>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-xs">{error}</div>
      )}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 overflow-x-auto">
        <Card className="flex-1 min-w-[260px] bg-violet-50 border-violet-200">
          <CardHeader>
            <CardTitle className="text-xl text-violet-800">SOL Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-lg text-violet-600">Loading your balance...</div>
            ) : (
              <div>
                <p className="text-4xl font-bold text-violet-900">{formatSol(portfolio.balance)} SOL</p>
                <p className="text-base text-violet-500">Network: {cluster.label}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[260px] bg-violet-50 border-violet-200">
          <CardHeader>
            <CardTitle className="text-xl text-violet-800">Token Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.tokens.length === 0 ? (
              <p className="text-lg text-violet-600">No tokens found in wallet</p>
            ) : (
              <div className="space-y-3">
                {portfolio.tokens.map((token, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="text-lg font-medium text-violet-900">{token.symbol || 'Unknown Token'}</span>
                      <p className="text-xs text-violet-400 font-mono">{token.mint}</p>
                    </div>
                    <span className="text-lg font-mono text-violet-800">{formatTokenAmount(token.amount, token.decimals)} {token.symbol}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[220px] bg-violet-50 border-violet-200">
          <CardHeader>
            <CardTitle className="text-xl text-violet-800">Total Value (Mock USD)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-violet-900">${calculateTotalValue().toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</p>
            <Button
              onClick={fetchPortfolioData}
              disabled={isLoading}
              className="mt-6 w-full text-lg py-4 px-8 bg-violet-700 hover:bg-violet-800 text-white"
            >
              Refresh Portfolio Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
