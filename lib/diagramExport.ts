/**
 * Utility functions for exporting diagrams as images
 */

/**
 * Download diagram as PNG image
 * Uses html2canvas or react-flow's viewport capture
 */
export async function downloadDiagramAsImage(
  reactFlowInstance: any,
  filename: string = "diagram"
): Promise<void> {
  if (!reactFlowInstance) {
    throw new Error("React Flow instance not available");
  }

  try {
    const nodes = reactFlowInstance.getNodes();
    if (!nodes || nodes.length === 0) {
      throw new Error("No diagram to download");
    }

    // Get the react-flow viewport element
    const viewport = document.querySelector('.react-flow__viewport');
    if (!viewport) {
      throw new Error("Could not find diagram viewport");
    }

    // Try to use html2canvas if available, otherwise use a simple canvas approach
    try {
      // Dynamic import of html2canvas (if installed)
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(viewport as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (html2canvasError) {
      // Fallback: Use react-flow's built-in export if available
      if (reactFlowInstance.toImage) {
        const dataUrl = await reactFlowInstance.toImage({
          pixelRatio: 2,
          backgroundColor: "#ffffff",
        });
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        // Final fallback: Show message to user
        alert("Download feature requires html2canvas. Please install it: npm install html2canvas");
      }
    }
  } catch (error) {
    console.error("Error exporting diagram:", error);
    throw error;
  }
}

