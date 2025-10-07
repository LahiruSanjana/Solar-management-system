import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { switchHomeTab } from "../../lib/redux/features/Uislice"
import { useDispatch } from "react-redux"

const Tab = (props) => {

  const dispatch=useDispatch();
  const selectedTab=useSelector((state)=>state.ui.selectedHomeTab);

  return (
    <Button
      className={`mr-4 mb-4 ${
        selectedTab === props.tab.value ? "bg-black text-white" : ""
      }`}
      key={props.tab.value}
      variant={selectedTab === props.tab.value ? "default" : "outline"}
      onClick={() => dispatch(switchHomeTab(props.tab.value))}
    >
      {props.tab.label}
    </Button>
  );
};

export default Tab;
