import { Button } from "@/components/ui/button"

const Tab = (props) => {
  return (
    <Button
      className={`mr-4 mb-4 ${
        props.selectedTab === props.tab.value ? "bg-black text-white" : ""
      }`}
      key={props.tab.value}
      variant={props.selectedTab === props.tab.value ? "default" : "outline"}
      onClick={() => props.onClick(props.tab.value)}
    >
      {props.tab.label}
    </Button>
  );
};

export default Tab;
