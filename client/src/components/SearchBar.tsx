import { Search } from "lucide-react"

const SearchBar = () => {
  return (
    <div className='hidden sm:flex items-center gap-2 rounded-md ring-1 ring-gray-200 px-2 py-1 shadow-md'>
      <Search className="w-8 h-5 text-gray-500"/>
      <input id="search" placeholder="Search your products" className="text-sm outline-0"/>
    </div>
  )
}

export default SearchBar