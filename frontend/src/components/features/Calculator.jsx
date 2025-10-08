import React, { useState, useEffect } from 'react';

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null || operand === '') return '';
  const str = String(operand);
  const [integer, decimal] = str.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [history, setHistory] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplayValue(String(digit));
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
    }
  };

  const inputDot = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
    } else if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setHistory('');
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      setHistory(h => h.slice(0, -2) + nextOperator + ' ');
      return;
    }

    if (firstOperand == null) {
      setFirstOperand(inputValue);
      setHistory(formatOperand(inputValue) + ' ' + nextOperator + ' ');
    } else if (operator) {
      const result = performCalculation[operator](firstOperand, inputValue);
      const newHistory = history + formatOperand(displayValue) + ' ' + nextOperator + ' ';
      setDisplayValue(String(result));
      setFirstOperand(result);
      setHistory(newHistory);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = {
    '/': (first, second) => first / second,
    '*': (first, second) => first * second,
    '+': (first, second) => first + second,
    '-': (first, second) => first - second,
  };

  const handleEquals = () => {
    if (!operator || firstOperand == null || waitingForSecondOperand) return;
    
    const secondOperand = parseFloat(displayValue);
    const result = performCalculation[operator](firstOperand, secondOperand);
    
    setHistory(h => h + formatOperand(displayValue) + ' =');
    setDisplayValue(String(result));
    setFirstOperand(null); // Reset for a new calculation
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  const percentage = () => {
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0 || waitingForSecondOperand) return;
    setDisplayValue(String(currentValue / 100));
  };

  const deleteDigit = () => {
    if (waitingForSecondOperand) return;
    setDisplayValue(displayValue.length > 1 ? displayValue.slice(0, -1) : '0');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1000); // Reset después de 1 segundo
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      const { key } = event;

      if (/\d/.test(key)) {
        inputDigit(parseInt(key, 10));
      } else if (key === '.') {
        inputDot();
      } else if (key === '%') {
        percentage();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEquals();
      } else if (key === 'Backspace') {
        deleteDigit();
      } else if (key === 'Escape') {
        clearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, displayValue, firstOperand, operator, waitingForSecondOperand, history]);


  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="btn-glass p-2 flex items-center space-x-2">
        <span className="material-icons">calculate</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 p-4">
          <div className="bg-gray-900 text-white p-4 rounded mb-4 min-h-[6rem]">
            <div className="text-right text-gray-400 text-lg h-6 truncate" title={history}>
              {history}
            </div>
            <div className="flex justify-between items-center">
              <button 
                onClick={handleCopy}
                className={`p-1 rounded-full hover:bg-gray-700 transition-colors ${copySuccess ? 'text-green-400' : 'text-gray-400'}`}
                title="Copy to clipboard"
              >
                <span className="material-icons text-xl">
                  {copySuccess ? 'check' : 'content_copy'}
                </span>
              </button>
              <div className="text-right text-3xl font-bold break-all">
                {formatOperand(displayValue)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button onClick={clearAll} className="p-2 bg-gray-200 rounded hover:bg-gray-300">AC</button>
            <button onClick={deleteDigit} className="p-2 bg-gray-200 rounded hover:bg-gray-300">DEL</button>
            <button onClick={percentage} className="p-2 bg-gray-200 rounded hover:bg-gray-300">%</button>
            <button onClick={() => handleOperator('/')} className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600">÷</button>

            <button onClick={() => inputDigit(7)} className="p-2 bg-gray-100 rounded hover:bg-gray-200">7</button>
            <button onClick={() => inputDigit(8)} className="p-2 bg-gray-100 rounded hover:bg-gray-200">8</button>
            <button onClick={() => inputDigit(9)} className="p-2 bg-gray-100 rounded hover:bg-gray-200">9</button>
            <button onClick={() => handleOperator('*')} className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600">×</button>

            <button onClick={() => inputDigit(4)} className="p-2 bg-gray-100 rounded hover:bg-gray-200">4</button>
            <button onClick={() => inputDigit(5)} className="p-2 bg-gray-100 rounded hover:bg-gray-200">5</button>
            <button onClick={() => inputDigit(6)} className="p-2 bg-gray-100 rounded hover:bg-gray-200">6</button>
            <button onClick={() => handleOperator('-')} className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600">-</button>

            <button onClick={() => inputDigit(1)} className="p-2 bg-gray-100 rounded hover:bg-gray-200">1</button>
            <button onClick={() => inputDigit(2)} className="p-2 bg-gray-100 rounded hover:bg-gray-200">2</button>
            <button onClick={() => inputDigit(3)} className="p-2 bg-gray-100 rounded hover:bg-gray-200">3</button>
            <button onClick={() => handleOperator('+')} className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600">+</button>

            <button onClick={() => inputDigit(0)} className="col-span-2 p-2 bg-gray-100 rounded hover:bg-gray-200">0</button>
            <button onClick={inputDot} className="p-2 bg-gray-100 rounded hover:bg-gray-200">.</button>
            <button onClick={handleEquals} className="p-2 bg-orange-500 text-white rounded hover:bg-orange-600">=</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;