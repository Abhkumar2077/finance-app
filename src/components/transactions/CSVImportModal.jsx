import { useState } from 'react'
import { Upload, FileSpreadsheet, Check, X, AlertCircle, X as CloseIcon } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

export function CSVImportModal({ onClose }) {
  const { dispatch } = useAppContext()
  const [step, setStep] = useState(1) // 1: Upload, 2: Preview, 3: Confirm
  const [file, setFile] = useState(null)
  const [previewData, setPreviewData] = useState([])
  const [columnMapping, setColumnMapping] = useState({})
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const expectedColumns = ['date', 'description', 'amount', 'category']

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file')
      return
    }

    setFile(selectedFile)
    parseCSV(selectedFile)
  }

  const parseCSV = (csvFile) => {
    setIsLoading(true)
    setErrors([])
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target.result
        const lines = content.split('\n').filter(line => line.trim() !== '')
        
        if (lines.length < 2) {
          setErrors(['File must contain at least a header row and one data row'])
          setIsLoading(false)
          return
        }

        // Get headers from first line
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
        
        // Auto-detect mapping
        const autoMapping = {}
        expectedColumns.forEach(expected => {
          const foundHeader = headers.find(h => 
            h.includes(expected) || expected.includes(h)
          )
          if (foundHeader) {
            autoMapping[expected] = foundHeader
          }
        })

        setColumnMapping(autoMapping)

        // Parse data rows (limit to 10 for preview)
        const dataRows = []
        const newErrors = []
        
        for (let i = 1; i < Math.min(lines.length, 11); i++) {
          const values = lines[i].split(',').map(v => v.trim())
          const row = {}
          
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })

          // Validate row
          const rowErrors = []
          if (!row.date) rowErrors.push('Missing date')
          if (!row.description) rowErrors.push('Missing description')
          if (!row.amount || isNaN(parseFloat(row.amount))) rowErrors.push('Invalid amount')
          
          if (rowErrors.length > 0) {
            newErrors.push(`Row ${i}: ${rowErrors.join(', ')}`)
          }
          
          dataRows.push({
            original: row,
            mapped: {},
            rowNumber: i,
            errors: rowErrors
          })
        }

        setPreviewData(dataRows)
        if (newErrors.length > 0) {
          setErrors(newErrors)
        }
        setStep(2)
      } catch (error) {
        setErrors(['Error parsing CSV file: ' + error.message])
      } finally {
        setIsLoading(false)
      }
    }

    reader.onerror = () => {
      setErrors(['Failed to read file'])
      setIsLoading(false)
    }

    reader.readAsText(csvFile)
  }

  const updateColumnMapping = (expectedColumn, csvColumn) => {
    setColumnMapping(prev => ({
      ...prev,
      [expectedColumn]: csvColumn
    }))
  }

  const getAvailableColumns = () => {
    if (previewData.length === 0) return []
    return Object.keys(previewData[0].original)
  }

  const handleConfirmMapping = () => {
    // Check if required columns are mapped
    const requiredMapped = ['date', 'description', 'amount'].every(col => columnMapping[col])
    
    if (!requiredMapped) {
      setErrors(['Please map all required columns: Date, Description, and Amount'])
      return
    }

    setStep(3)
  }

  const handleImport = () => {
    if (previewData.length === 0) {
      setErrors(['No data to import'])
      return
    }

    // Import all valid rows
    const importedCount = previewData.filter(row => row.errors.length === 0).length
    
    previewData.forEach((row, index) => {
      if (row.errors.length === 0) {
        const amount = parseFloat(row.original[columnMapping.amount]) || 0
        const transaction = {
          id: Date.now() + index,
          name: row.original[columnMapping.description] || 'Imported Transaction',
          amount: amount,
          date: formatDate(row.original[columnMapping.date]),
          type: amount >= 0 ? 'income' : 'expense',
          category: row.original[columnMapping.category] || 'Imported',
          source: 'csv'
        }

        dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
      }
    })

    alert(`Successfully imported ${importedCount} transactions!`)
    onClose()
  }

  const formatDate = (dateString) => {
    try {
      // Try to parse various date formats
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const resetImport = () => {
    setStep(1)
    setFile(null)
    setPreviewData([])
    setColumnMapping({})
    setErrors([])
  }

  return (
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Import CSV</h2>
          <p className="text-gray-600">Upload your bank statements</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CloseIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-24 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-24 h-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Upload CSV File
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Upload your bank statement or transaction history in CSV format.
                We'll help you map the columns.
              </p>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <div className={`px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${
                  isLoading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                }`}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-5 w-5" />
                      Choose CSV File
                    </>
                  )}
                </div>
              </label>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>Expected columns: date, description, amount, category</p>
                <p className="mt-1">Supported formats: CSV (comma-separated)</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preview & Mapping */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Map CSV Columns
              </h3>
              <button
                onClick={resetImport}
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Upload different file
              </button>
            </div>

            {/* Column Mapping */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Column Mapping</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expectedColumns.map((expected) => (
                  <div key={expected} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {expected}
                      {['date', 'description', 'amount'].includes(expected) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </span>
                    <select
                      value={columnMapping[expected] || ''}
                      onChange={(e) => updateColumnMapping(expected, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white"
                    >
                      <option value="">Select column...</option>
                      {getAvailableColumns().map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                <span className="text-red-500">*</span> Required columns
              </p>
            </div>

            {/* Data Preview */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">
                Preview (first 10 rows)
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 text-left font-medium text-gray-700 border-b">Row</th>
                      {expectedColumns.map((col) => (
                        <th key={col} className="py-2 px-3 text-left font-medium text-gray-700 border-b capitalize">
                          {col} {columnMapping[col] && `→ ${columnMapping[col]}`}
                        </th>
                      ))}
                      <th className="py-2 px-3 text-left font-medium text-gray-700 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row) => (
                      <tr key={row.rowNumber} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 px-3 text-gray-500">{row.rowNumber}</td>
                        {expectedColumns.map((col) => (
                          <td key={col} className="py-2 px-3">
                            {columnMapping[col] ? (
                              <span className={row.original[columnMapping[col]] ? '' : 'text-red-500'}>
                                {row.original[columnMapping[col]] || 'Empty'}
                              </span>
                            ) : (
                              <span className="text-red-500">Not mapped</span>
                            )}
                          </td>
                        ))}
                        <td className="py-2 px-3">
                          {row.errors.length === 0 ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h4 className="font-medium text-red-700">Validation Errors</h4>
                </div>
                <ul className="text-sm text-red-600 space-y-1">
                  {errors.slice(0, 5).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li>... and {errors.length - 5} more errors</li>
                  )}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmMapping}
                disabled={isLoading || !['date', 'description', 'amount'].every(col => columnMapping[col])}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Import
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Import */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Ready to Import
              </h3>
              <p className="text-green-700 mb-4">
                {previewData.filter(r => r.errors.length === 0).length} valid transactions found
              </p>
            </div>

            {/* Import Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-800 mb-4">Import Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {previewData.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Rows</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {previewData.filter(r => r.errors.length === 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Valid</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {previewData.filter(r => r.errors.length > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">With Errors</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {columnMapping.category ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-gray-600">Category Mapped</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleImport}
                className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Import {previewData.filter(r => r.errors.length === 0).length} Transactions
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back to Mapping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}