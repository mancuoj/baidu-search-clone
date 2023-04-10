import React, { useState } from 'react'
import keywords from '../../keywords.json'

interface Keyword {
  id: number
  text: string
}

export default function Search() {
  const [inputValue, setInputValue] = useState('')
  const [suggestionList, setSuggestionList] = useState<Keyword[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInputValue(value)
    setSelectedIndex(-1)
    if (value) {
      const filteredKeywords = keywords.filter(keyword => keyword.text.startsWith(value))
      setSuggestionList(filteredKeywords)
      setShowSuggestions(filteredKeywords.length > 0)
    } else {
      setSuggestionList([])
      setShowSuggestions(false)
    }
  }

  function handleInputClear() {
    setInputValue('')
    setSuggestionList([])
    setShowSuggestions(false)
  }

  function handleBlur() {
    // 等待一段时间后隐藏下拉框，避免用户误操作
    setTimeout(() => setShowSuggestions(false), 200)
  }

  function handleFocus() {
    if (suggestionList.length > 0)
      setShowSuggestions(true)
  }

  function handleSuggestionClick(suggestion: Keyword) {
    setInputValue(suggestion.text)
    setSuggestionList([])
    setShowSuggestions(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prevIndex => (prevIndex <= 0 ? suggestionList.length - 1 : prevIndex - 1))
        break
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prevIndex => (prevIndex >= suggestionList.length - 1 ? 0 : prevIndex + 1))
        break
      case 'Enter':
        if (selectedIndex >= 0) {
          setInputValue(suggestionList[selectedIndex].text)
          setSuggestionList([])
          setShowSuggestions(false)
        }
        break
      default:
        break
    }
  }

  return (
    <div className='flex'>
      <div className='relative'>
        <input
          type="text"
          className={
            `w-96 h-12 px-4 py-3 text-[#222] bg-white outline-none border-2 border-gray-500 rounded-l-xl
            ${showSuggestions && 'rounded-bl-none border-b-0'}  hover:border-gray-800 focus:border-blue-600`
          }
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          maxLength={100}
          autoComplete="false"
        />
        {inputValue && <button onClick={handleInputClear} className='absolute right-4 top-2.5 text-lg text-gray-400'>X</button>}
        {
          showSuggestions && (
            <ul className='absolute z-10 w-full py-2 border-2 border-blue-600 bg-white text-[#222] rounded-b-xl'>
              {
                suggestionList.map((suggestion, index) => (
                  <li
                    key={suggestion.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${index === selectedIndex && 'bg-gray-200'}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.text}
                  </li>
                ))
              }
            </ul>
          )
        }
      </div>
      <button className="h-12 px-4 py-3 cursor-pointer text-white bg-blue-600 outline-none border-2 border-blue-600 rounded-r-xl">
        百度一下
      </button>
    </div>
  )
}
