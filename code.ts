figma.showUI(__html__, { width: 700, height: 700 });

if (figma.editorType === "figma") {
  figma.ui.onmessage = (msg) => {
    if (msg.type === "paste-to-canvas") {
      const { data } = msg;
      const { bytes, w, h } = data;

      const frame = figma.createFrame();
      frame.name = "segment result";
      frame.fills = [];
      frame.resize(w, h);

      frame.fills = [
        {
          type: "IMAGE",
          imageHash: figma.createImage(bytes).hash,
          scaleMode: "FIT",
        },
      ];
      figma.currentPage.appendChild(frame);
      frame.x = figma.viewport.center.x;
      frame.y = figma.viewport.center.y;

      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
      figma.notify("✂️ Cut out image added into the canvas!");
    }
  };
}
