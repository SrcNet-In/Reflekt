import type {MouseEvent} from "react";
import type {Node} from "@xyflow/react";

export function createNewNode(
    event: MouseEvent,
    reactFlowInstance: any,
    setNodes: (updater: (prevNodes: Node[]) => Node[]) => void
) {
    const target = event.target as HTMLElement;
    if (target.classList.contains("react-flow__pane")) {
        const flowPosition = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });
        const newNode = {
            id: `${Date.now()}`,
            type: "default",
            position: flowPosition,
            data: { label: "New Node" },
        };
        setNodes((prevNodes) => [...prevNodes, newNode]);
    }
}