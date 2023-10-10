
export const Notification = () => {

  // NB You can set colours dynamically in tailwind CSS. 
  // See: https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values

  return (

    <div className= "border border-gray-600 rounded-lg h-full p-2 mt-1"> 
      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: "5%"}}> 45%</div>
      </div>
    </div>
  )

}