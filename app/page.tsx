"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type NumberSystem = "decimal" | "binary" | "hexadecimal"

export default function Home() {
  const [input, setInput] = useState("")
  const [fromSystem, setFromSystem] = useState<NumberSystem>("decimal")
  const [toSystem, setToSystem] = useState<NumberSystem>("binary")
  const [result, setResult] = useState<string>("")
  const [steps, setSteps] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const validateInput = (): boolean => {
    setError(null)
    if (input.trim() === "") {
      setError("Please enter a number.")
      return false
    }

    switch (fromSystem) {
      case "decimal":
        if (!/^\d+$/.test(input)) {
          setError("Invalid decimal number. Please enter only digits (0-9).")
          return false
        }
        break
      case "binary":
        if (!/^[01]+$/.test(input)) {
          setError("Invalid binary number. Please enter only 0s and 1s.")
          return false
        }
        break
      case "hexadecimal":
        if (!/^[0-9A-Fa-f]+$/.test(input)) {
          setError("Invalid hexadecimal number. Please enter only digits (0-9) and letters A-F.")
          return false
        }
        break
    }

    return true
  }

  const convert = () => {
    if (!validateInput()) {
      setResult("")
      setSteps([])
      return
    }

    let decimal: number
    let conversionSteps: string[] = []

    // Convert input to decimal
    if (fromSystem === "decimal") {
      decimal = parseInt(input)
      conversionSteps.push(`Start with decimal number: ${decimal}`)
    } else if (fromSystem === "binary") {
      decimal = parseInt(input, 2)
      conversionSteps.push(`Convert binary ${input} to decimal:`)
      conversionSteps.push(binaryToDecimalSteps(input))
      conversionSteps.push(`Resulting decimal: ${decimal}`)
    } else {
      decimal = parseInt(input, 16)
      conversionSteps.push(`Convert hexadecimal ${input} to decimal:`)
      conversionSteps.push(hexToDecimalSteps(input))
      conversionSteps.push(`Resulting decimal: ${decimal}`)
    }

    // Convert decimal to target system
    if (toSystem === "decimal") {
      setResult(decimal.toString())
    } else if (toSystem === "binary") {
      const binary = decimal.toString(2)
      conversionSteps.push(`Convert decimal ${decimal} to binary:`)
      conversionSteps.push(decimalToBinarySteps(decimal))
      conversionSteps.push(`Resulting binary: ${binary}`)
      setResult(binary)
    } else {
      const hex = decimal.toString(16).toUpperCase()
      conversionSteps.push(`Convert decimal ${decimal} to hexadecimal:`)
      conversionSteps.push(decimalToHexSteps(decimal))
      conversionSteps.push(`Resulting hexadecimal: ${hex}`)
      setResult(hex)
    }

    setSteps(conversionSteps)
  }

  const binaryToDecimalSteps = (binary: string): string => {
    let decimal = 0
    let steps = "In binary, each digit represents a power of 2, starting from 2^0 on the right:\n\n"
    for (let i = 0; i < binary.length; i++) {
      const digit = parseInt(binary[i])
      const power = binary.length - 1 - i
      const value = digit * Math.pow(2, power)
      decimal += value
      steps += `Digit ${binary.length - i} (from right): ${digit} * 2^${power} = ${value}\n`
      steps += `  - This represents ${digit} groups of ${Math.pow(2, power)}\n`
      steps += `  - Running total: ${decimal}\n\n`
    }
    steps += `Sum all values: ${decimal}\n`
    steps += `\nExplanation: We multiply each binary digit by its corresponding power of 2 and sum the results.`
    return steps
  }

  const hexToDecimalSteps = (hex: string): string => {
    let decimal = 0
    let steps = "In hexadecimal, each digit represents a power of 16, starting from 16^0 on the right:\n\n"
    for (let i = 0; i < hex.length; i++) {
      const digit = parseInt(hex[i], 16)
      const power = hex.length - 1 - i
      const value = digit * Math.pow(16, power)
      decimal += value
      steps += `Digit ${hex.length - i} (from right): ${hex[i]} (decimal ${digit}) * 16^${power} = ${value}\n`
      steps += `  - This represents ${digit} groups of ${Math.pow(16, power)}\n`
      steps += `  - Running total: ${decimal}\n\n`
    }
    steps += `Sum all values: ${decimal}\n`
    steps += `\nExplanation: We multiply each hexadecimal digit (converted to decimal) by its corresponding power of 16 and sum the results.`
    return steps
  }

  const decimalToBinarySteps = (decimal: number): string => {
    let steps = "To convert decimal to binary, we repeatedly divide by 2 and keep track of the remainders:\n\n"
    let quotient = decimal
    let remainders = []
    while (quotient > 0) {
      remainders.unshift(quotient % 2)
      steps += `${quotient} ÷ 2 = ${Math.floor(quotient / 2)} remainder ${quotient % 2}\n`
      steps += `  - The remainder (${quotient % 2}) becomes a binary digit\n`
      steps += `  - Current binary number: ${remainders.join("")} (read from right to left)\n\n`
      quotient = Math.floor(quotient / 2)
    }
    steps += `Final binary number: ${remainders.join("")} (read from left to right)\n`
    steps += `\nExplanation: The remainders in reverse order form the binary number. Each '1' represents a power of 2 that sums to the original decimal number.`
    return steps
  }

  const decimalToHexSteps = (decimal: number): string => {
    let steps = "To convert decimal to hexadecimal, we repeatedly divide by 16 and keep track of the remainders:\n\n"
    let quotient = decimal
    let remainders = []
    while (quotient > 0) {
      const remainder = quotient % 16
      remainders.unshift(remainder < 10 ? remainder.toString() : String.fromCharCode(55 + remainder))
      steps += `${quotient} ÷ 16 = ${Math.floor(quotient / 16)} remainder ${remainder} (hex digit: ${remainders[0]})\n`
      steps += `  - Remainders 0-9 stay as is, 10-15 become A-F\n`
      steps += `  - Current hex number: ${remainders.join("")} (read from right to left)\n\n`
      quotient = Math.floor(quotient / 16)
    }
    steps += `Final hexadecimal number: ${remainders.join("")} (read from left to right)\n`
    steps += `\nExplanation: The remainders in reverse order form the hexadecimal number. Each digit represents a power of 16 that sums to the original decimal number.`
    return steps
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Number System Converter</CardTitle>
          <CardDescription>Convert between decimal, binary, and hexadecimal with detailed step-by-step explanations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="input">Enter number:</Label>
              <Input
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a number"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>From:</Label>
                <RadioGroup value={fromSystem} onValueChange={(value) => setFromSystem(value as NumberSystem)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="decimal" id="from-decimal" />
                    <Label htmlFor="from-decimal">Decimal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="binary" id="from-binary" />
                    <Label htmlFor="from-binary">Binary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hexadecimal" id="from-hexadecimal" />
                    <Label htmlFor="from-hexadecimal">Hexadecimal</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>To:</Label>
                <RadioGroup value={toSystem} onValueChange={(value) => setToSystem(value as NumberSystem)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="decimal" id="to-decimal" />
                    <Label htmlFor="to-decimal">Decimal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="binary" id="to-binary" />
                    <Label htmlFor="to-binary">Binary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hexadecimal" id="to-hexadecimal" />
                    <Label htmlFor="to-hexadecimal">Hexadecimal</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <Button onClick={convert}>Convert</Button>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && (
              <div>
                <Label>Result:</Label>
                <div className="p-2 bg-secondary rounded">{result}</div>
              </div>
            )}
            {steps.length > 0 && (
              <div>
                <Label>Detailed step-by-step conversion:</Label>
                <pre className="p-2 bg-secondary rounded whitespace-pre-wrap text-sm">{steps.join("\n\n")}</pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}