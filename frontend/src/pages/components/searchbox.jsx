import  { useState } from "react";
import { useCombobox } from 'downshift';

function ItemChosen( item , props) {
    console.log("Item chosen")
    props.setChosenClasses([...props.chosen_classes, item])
    props.setShowPlus(true)
}

function ComboBoxExample(props) {


  function getClassFilter(inputValue) {
    const lowerCasedInputValue = inputValue.toLowerCase().replaceAll(" ", "")

    return function booksFilter(class_) {
      return (
        !inputValue ||
        class_.toLowerCase().replaceAll(" ", "").includes(lowerCasedInputValue)
      )
    }
  }

  function ComboBox() {
    const [items, setItems] = useState(props.classList)
    const {
      isOpen,
      getMenuProps,
      getInputProps,
      getItemProps,
    } = useCombobox({
      onInputValueChange({inputValue}) {
        setItems(props.classList.filter(getClassFilter(inputValue)))
      },
      items,
      itemToString(item) {
        return item
      },
    })

    function enterHandler(event) {
      if (event.key === "Enter") {
        if (items.length) {
          ItemChosen(items[0], props)
        }
      }
    }



    return (
      <div className="flex flex-col">
        <div className={"flex flex-row rounded-full bg-transparent border-black border-2 p-2 sm:p-3 transition-[border-radius] duration-75 " + (isOpen ? "rounded-br-none" : "")}>
          <span className="material-symbols-outlined text-3xl sm:text-4xl pr-3">search</span>
          <input
          className="text-2xl sm:text-3xl bg-transparent outline-none placeholder:text-slate-600 w-32 sm:w-36"
          type="text"
          placeholder="search"
          onKeyUp={enterHandler}
          {...getInputProps()}
          ref={input => input && props.chosen_classes != 0 && input.focus()}   // ngl I don't know what this does but it makes the autofocus work       
          />
        </div>

        <ul
          className={"border-black border-2 rounded-b-3xl border-t-0 pr-6 sm:pr-8 pb-2 pl-1 max-w-max self-end " + (!(isOpen && items.length) ? "hidden" : "")}
          {...getMenuProps()}
        >
          {isOpen &&
            items.slice(0,5).map((item, index) => (
              <li
                className="text-2xl sm:text-3xl w-38 py-2 sm:py-3 px-2 max-w-max cursor-pointer hover:scale-105 transition duration-150"
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