import { useAppDispatch, useAppSelector} from "@/redux/hooks"
import { MinusCircleIcon } from "@heroicons/react/24/outline"

export const NotificationDialog = () => {
  const { notifications } = useAppSelector(state => state.notification)
  const emptySpace = " "
  


  // NB You can set colours dynamically in tailwind CSS. 
  // See: https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values

  return (
    notifications[0] === undefined ? null 
    : 
    <div className= "relative border border-gray-600 rounded-lg h-12 mt-1"> 
      
      { notifications[0].message  }
      <button 
        className="font-bold"
        type="submit"
        // onClick={ }
        >
          <MinusCircleIcon
            className="h-8 w-8 text-red-400 hover:text-red-600 items-center justify-center"
            aria-hidden="true"
          />
      </button>

      <div className="absolute bottom-0 bg-blue-600 text-xs font-medium text-center text-blue-100/0 leading-none rounded-bl-md h-2" style={{width:`25%`}}> INVISIBLE TEXT </div>
      
    </div>
  )

  //  ${notifications[0].progress}

}