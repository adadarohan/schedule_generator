import  { useState } from "react";
import { useCombobox } from 'downshift';

function ItemChosen( item , props) {
    props.setChosenClasses([...props.chosen_classes, item])
}

function ComboBoxExample(props) {
    const books = ['ECE 120', 'ECE 110', 'ECE 210', 'ECE 220']
    function getBooksFilter(inputValue) {
      const lowerCasedInputValue = inputValue.toLowerCase()
  
      return function booksFilter(book) {
        return (
          !inputValue ||
          book.toLowerCase().includes(lowerCasedInputValue)
        )
      }
    }
  
    function ComboBox() {
      const [items, setItems] = useState(books)
      const {
        isOpen,
        getMenuProps,
        getInputProps,
        getItemProps,
      } = useCombobox({
        onInputValueChange({inputValue}) {
          setItems(books.filter(getBooksFilter(inputValue)))
        },
        items,
        itemToString(item) {
          return item
        },
      })
  
      return (
        <div>
          <div className="flex flex-row rounded-full bg-transparent border-black border-2 py-3 px-3">
            <span className="material-symbols-outlined text-4xl pr-3">search</span>
            <input
            className="text-3xl bg-transparent outline-none placeholder:text-slate-600 w-36"
            type="text"
            placeholder="search"
            {...getInputProps()}
            />
          </div>

          <ul
            className={`absolute w-72 bg-white mt-1 shadow-md max-h-80 overflow-scroll p-0 z-10 ${
              !(isOpen && items.length) && "hidden"
            }`}
            {...getMenuProps()}
          >
            {isOpen &&
              items.map((item, index) => (
                <li
                  className="py-2 px-3 shadow-sm flex flex-col hover:bg-gray-100 cursor-pointer"
                  key={item}
                  {...getItemProps({ item, index })}
                  onClick={() => ItemChosen(item, props)}
                >
                  <span>{item}</span>
                </li>
              ))}
          </ul>
        </div>
      );
    }
    return <ComboBox />
  }


export default ComboBoxExample