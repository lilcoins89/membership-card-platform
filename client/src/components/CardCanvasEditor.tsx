import Konva from "konva";
import { Download, Move, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Circle, Layer, Rect, Stage, Text, Transformer } from "react-konva";
import { toast } from "sonner";

type Variant = "midnight" | "clay" | "cloud";
type EditableText = { id: string; text: string; x: number; y: number; width: number; fontSize: number; fill: string; fontStyle?: string; letterSpacing?: number };
type CardCanvasEditorProps = { name: string; memberId: string; expiry: string; organization: string; tier: string; accent: string; variant: Variant };

const palette: Record<Variant, { background: string; foreground: string; muted: string; edge: string }> = {
  midnight: { background: "#17191d", foreground: "#f7f8f2", muted: "#99a09e", edge: "#c7f36b" },
  clay: { background: "#f2c1ae", foreground: "#2b2523", muted: "#755f58", edge: "#f29c82" },
  cloud: { background: "#dff2ff", foreground: "#1b3645", muted: "#5f7d8e", edge: "#8bc9f5" },
};

function createTextNodes(props: CardCanvasEditorProps, colors: typeof palette[Variant]): EditableText[] {
  return [
    { id: "brand", text: `◈  ${props.organization}`, x: 30, y: 27, width: 270, fontSize: 14, fill: colors.foreground, fontStyle: "bold", letterSpacing: 2 },
    { id: "edition", text: "MEMBERSHIP / 2025", x: 366, y: 29, width: 140, fontSize: 8, fill: colors.muted, letterSpacing: 1 },
    { id: "status", text: "N° 001 / ACTIVE", x: 379, y: 113, width: 125, fontSize: 8, fill: props.accent, fontStyle: "bold", letterSpacing: 1 },
    { id: "tier", text: props.tier, x: 31, y: 214, width: 220, fontSize: 9, fill: colors.muted, letterSpacing: 2 },
    { id: "name", text: props.name || "Member name", x: 31, y: 235, width: 310, fontSize: 26, fill: colors.foreground, fontStyle: "bold" },
    { id: "id", text: `${props.memberId || "CRD-0000"}  ·  VALID THRU ${props.expiry || "12 / 26"}`, x: 31, y: 287, width: 315, fontSize: 9, fill: colors.muted, letterSpacing: 1 },
    { id: "qr-label", text: "SCAN TO VERIFY", x: 385, y: 286, width: 118, fontSize: 8, fill: colors.muted, letterSpacing: 1 },
  ];
}

export default function CardCanvasEditor(props: CardCanvasEditorProps) {
  const colors = palette[props.variant];
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const selectedNodeRef = useRef<Konva.Text>(null);
  const [selectedId, setSelectedId] = useState("name");
  const [nodes, setNodes] = useState(() => createTextNodes(props, colors));

  useEffect(() => {
    setNodes(current => current.map(node => {
      if (node.id === "brand") return { ...node, text: `◈  ${props.organization}`, fill: colors.foreground };
      if (node.id === "edition") return { ...node, fill: colors.muted };
      if (node.id === "status") return { ...node, fill: props.accent };
      if (node.id === "tier") return { ...node, text: props.tier, fill: colors.muted };
      if (node.id === "name") return { ...node, text: props.name || "Member name", fill: colors.foreground };
      if (node.id === "id") return { ...node, text: `${props.memberId || "CRD-0000"}  ·  VALID THRU ${props.expiry || "12 / 26"}`, fill: colors.muted };
      if (node.id === "qr-label") return { ...node, fill: colors.muted };
      return node;
    }));
  }, [props.organization, props.tier, props.name, props.memberId, props.expiry, props.accent, props.variant, colors.foreground, colors.muted]);

  useEffect(() => {
    const transformer = transformerRef.current;
    const node = selectedNodeRef.current;
    if (!transformer || !node) return;
    transformer.nodes([node]);
    transformer.getLayer()?.batchDraw();
  }, [selectedId, nodes]);

  const updatePosition = (id: string, event: Konva.KonvaEventObject<DragEvent>) => {
    setNodes(current => current.map(node => node.id === id ? { ...node, x: event.target.x(), y: event.target.y() } : node));
  };

  const resetLayout = () => {
    setNodes(createTextNodes(props, colors));
    setSelectedId("name");
    toast.success("Card layout reset.");
  };

  const exportPng = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const link = document.createElement("a");
    link.download = `${props.memberId || "cardly-card"}.png`;
    link.href = stage.toDataURL({ pixelRatio: 2 });
    link.click();
    toast.success("Card preview exported as PNG.");
  };

  return <div className="canvas-editor-shell"><div className="canvas-editor-toolbar"><span><Move size={14} /> Drag text to position</span><div><button className="canvas-tool-button" onClick={resetLayout}><RotateCcw size={13} /> Reset</button><button className="canvas-tool-button canvas-tool-primary" onClick={exportPng}><Download size={13} /> Export PNG</button></div></div><div className="konva-stage-wrap" onClick={event => { if (event.target === event.currentTarget) setSelectedId(""); }}><Stage ref={stageRef} width={540} height={340} onMouseDown={event => { if (event.target === event.target.getStage()) setSelectedId(""); }}><Layer><Rect x={0} y={0} width={540} height={340} cornerRadius={24} fill={colors.background} shadowColor="#111" shadowBlur={22} shadowOpacity={.18} shadowOffsetY={13} /><Circle x={512} y={-2} radius={115} fill={props.accent} opacity={.92} /><Rect x={30} y={92} width={36} height={27} cornerRadius={5} stroke={colors.muted} strokeWidth={1.5} /><Rect x={37} y={98} width={8} height={7} stroke={colors.muted} strokeWidth={1} /><Rect x={51} y={98} width={8} height={7} stroke={colors.muted} strokeWidth={1} /><Rect x={37} y={108} width={8} height={7} stroke={colors.muted} strokeWidth={1} /><Rect x={51} y={108} width={8} height={7} stroke={colors.muted} strokeWidth={1} /><Rect x={405} y={207} width={74} height={74} fill="#fff" cornerRadius={4} /><Text x={417} y={220} text="▦" fontSize={49} fill="#101216" fontStyle="bold" /><Text x={406} y={297} text="CARDLY VERIFIED" width={90} align="center" fontSize={7} fill={colors.muted} letterSpacing={1} />{nodes.map(node => <Text key={node.id} {...node} draggable onClick={() => setSelectedId(node.id)} onTap={() => setSelectedId(node.id)} onDragEnd={event => updatePosition(node.id, event)} ref={instance => { if (node.id === selectedId && instance) selectedNodeRef.current = instance; }} />)}<Transformer ref={transformerRef} rotateEnabled={false} enabledAnchors={["middle-left", "middle-right"]} boundBoxFunc={(oldBox, newBox) => newBox.width < 50 ? oldBox : newBox} borderStroke={props.accent} anchorStroke={props.accent} anchorFill="#fff" anchorSize={7} /></Layer></Stage></div><small className="canvas-editor-hint">Select a text layer to resize it with the handles. Canvas coordinates stay inside the CR80 safe area.</small></div>;
}
