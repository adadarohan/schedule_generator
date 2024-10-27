import SelectBox from '@/components/schedule/selectbox'

export default function MultiSelectForm() {
  const options = [
    { value: 'One', label: 'One' },
    { value: 'Two', label: 'Two' },
    { value: 'Three', label: 'Three' },
    { value: 'Four', label: 'Four' },
    { value: 'Five', label: 'Five' },
    { value: 'Six', label: 'Six' },
    { value: 'Seven', label: 'Seven' },
    { value: 'Eight', label: 'Eight' },
    { value: 'Nine', label: 'Nine' },
    { value: 'Ten', label: 'Ten' },
    { value: 'Eleven', label: 'Eleven' },
    { value: 'Twelve', label: 'Twelve' },
    { value: 'Thirteen', label: 'Thirteen' },
    { value: 'Fifteen', label: 'Fifteen' }
  ]

  function onChange(value) {
    console.log(value)
  }


  return (

    <SelectBox
        options={options}
        value={["One"]}
        onChange={onChange}
        placeholder="Select a numbers..."
        inputPlaceholder="Search numbers"
        emptyPlaceholder="No number found."
        multiple
    />
               
  )
}
