// figma.showUI(__html__, { width: 700, height: 700 });
figma.showUI(
  `<script>window.location.href = 'https://cutout.glitch.me/'</script>`,
  { width: 600, height: 600 }
);

if (figma.editorType === "figma") {
  figma.ui.onmessage = (msg) => {
    if (msg.type === "paste-to-canvas") {
      const { data } = msg;
      const { bytes, w, h } = data;

      // form a frame
      const frame = figma.createFrame();
      frame.name = "✂️ segment result";
      frame.fills = [];
      frame.resize(w, h);

      // content 1: image
      const rectangle = figma.createRectangle();
      rectangle.name = "image";
      rectangle.resize(w, h);
      rectangle.fills = [
        {
          type: "IMAGE",
          imageHash: figma.createImage(bytes).hash,
          scaleMode: "FIT",
        },
      ];
      frame.appendChild(rectangle);

      // content 2: outline stroke
      const pathData = msg.path.data;
      const svgPath = figma.createNodeFromSvg(`
        <svg width="100%" height="100%">
          <path d="${pathData}" />
        </svg>
      `);
      svgPath.name = "svg-outline";
      const c = svgPath.children[0] as VectorNode;
      c.fills = [];
      c.strokes = [
        {
          blendMode: "NORMAL",
          color: { r: 1, g: 1, b: 1 },
          opacity: 1,
          type: "SOLID",
          visible: true,
        },
      ];
      c.strokeCap = "ROUND";
      c.strokeJoin = "ROUND";
      c.strokeAlign = "OUTSIDE";
      c.strokeWeight = Math.max(w, h) / 40;
      c.name = "outline";

      figma.currentPage.selection = [svgPath];
      figma.flatten(figma.currentPage.selection, frame);
      figma.currentPage.appendChild(frame);

      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
      figma.notify("✂️ Cut out image added into the canvas!");
    }
  };
}
