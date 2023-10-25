import { useAppDispatch, useAppSelector} from "@/redux/hooks"
import { XMarkIcon } from "@heroicons/react/24/outline"

const notifications = [{
  id: "test",
  message: "TEST TEST",
  colour: "red", 
  progress: 50 
}]

export const NotificationDialog = () => {
  // const { notifications } = useAppSelector(state => state.notification)

  // NB You can set colours dynamically in tailwind CSS. 
  // See: https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values

  return (
    notifications[0] === undefined ? null 
    : 
    <div className= "relative border-2 border-red-600 bg-red-300 rounded-lg h-12 flex flex-row  items-center"> 
        <div className="grow text-red-500 flex flex-row justify-center">  
          <div  className="font-bold"> 
          { notifications[0].message  }
          </div>
        </div>
        <button 
          className="font-bold text-lg pe-2"
          type="submit"
          // onClick={ }
          >
            <XMarkIcon
              className="h-6 w-6 text-red-400 hover:text-red-600 content-center align-center"
              aria-hidden="true"
            />
        </button>
      <div className="absolute bottom-0 bg-red-600 text-xs font-medium text-center text-red-100/0 leading-none rounded-bl-md h-1" style={{width:`9%`}}> INVISIBLE TEXT </div>
      
    </div>
  )

  //  ${notifications[0].progress}

}