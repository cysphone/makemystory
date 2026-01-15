"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Story } from "@/app/actions";
import { Download, Share2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export function StoryBook({ story }: { story: Story }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const fullComicRef = useRef<HTMLDivElement>(null);

    const nextPage = () => {
        if (currentPage < story.pages.length - 1) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const downloadPDF = async () => {
        if (!fullComicRef.current) return;
        setIsDownloading(true);
        try {
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: "a4"
            });

            const pages = fullComicRef.current.children;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            for (let i = 0; i < pages.length; i++) {
                const pageElement = pages[i] as HTMLElement;

                // Capture the page
                const canvas = await html2canvas(pageElement, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    allowTaint: true,
                    backgroundColor: "#ffffff"
                });

                const imgData = canvas.toDataURL("image/jpeg", 0.95);

                // Calculate dimensions to fit A4 keeping aspect ratio
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pageWidth;
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`${story.coupleNames.replace(/\s+/g, "_")}_Comic.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Could not generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const currentStoryPage = story.pages[currentPage];

    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col items-center py-8 font-comic">
            {/* Header / Controls */}
            <div className="w-full max-w-4xl flex justify-between items-center px-4 mb-6">
                <h1 className="text-3xl font-bangers text-rose-600 drop-shadow-[1px_1px_0px_black]">
                    {story.title.toUpperCase()}
                </h1>
                <Button
                    onClick={downloadPDF}
                    disabled={isDownloading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
                >
                    {isDownloading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> SAVING...</> : <><Download className="w-4 h-4 mr-2" /> DOWNLOAD PDF</>}
                </Button>
            </div>

            {/* Visible Comic Page Container */}
            <div
                className="bg-white w-full max-w-3xl shadow-2xl border-4 border-black p-6 md:p-8 relative min-h-[800px]"
            >
                {/* Page Number */}
                <div className="absolute top-2 right-4 font-bangers text-xl text-gray-400">
                    PAGE {currentPage + 1}
                </div>

                {/* Panels Grid */}
                <div className="grid grid-cols-1 gap-6 mt-4">
                    {currentStoryPage.panels.map((panel, idx) => (
                        <div key={idx} className="relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-100 overflow-hidden group">

                            {/* Panel Image */}
                            {panel.imageUrl ? (
                                <img
                                    src={panel.imageUrl}
                                    alt={panel.description}
                                    className="w-full h-auto object-cover"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-400 font-bangers text-2xl">
                                    IMAGE LOADING...
                                </div>
                            )}

                            {/* Caption Box */}
                            {panel.caption && (
                                <div className="absolute top-0 left-0 bg-yellow-300 border-b-2 border-r-2 border-black p-2 max-w-[80%]">
                                    <p className="font-bold text-sm uppercase tracking-wide leading-tight">
                                        {panel.caption}
                                    </p>
                                </div>
                            )}

                            {/* Speech Bubbles */}
                            {panel.speechBubbles?.map((bubble, bIdx) => (
                                <div
                                    key={bIdx}
                                    className={`absolute p-3 bg-white border-2 border-black rounded-[50%] shadow-md max-w-[200px] text-center
                                        ${bIdx % 2 === 0 ? 'bottom-4 left-4 rounded-bl-none' : 'bottom-4 right-4 rounded-br-none'}
                                    `}
                                >
                                    <p className="font-bangers text-xs text-rose-600 mb-1">{bubble.character}</p>
                                    <p className="text-xs font-bold leading-tight">{bubble.text}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-8 mt-8">
                <Button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    variant="ghost"
                    className="text-black hover:bg-yellow-200 disabled:opacity-30"
                >
                    <ChevronLeft className="w-8 h-8" /> PREV
                </Button>
                <span className="font-bangers text-2xl self-center">
                    {currentPage + 1} / {story.pages.length}
                </span>
                <Button
                    onClick={nextPage}
                    disabled={currentPage === story.pages.length - 1}
                    variant="ghost"
                    className="text-black hover:bg-yellow-200 disabled:opacity-30"
                >
                    NEXT <ChevronRight className="w-8 h-8" />
                </Button>
            </div>

            {/* Hidden Full Comic for PDF Generation */}
            <div
                ref={fullComicRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: "-10000px",
                    width: "800px", // Fixed width for consistent PDF generation
                }}
            >
                {story.pages.map((page, pageIdx) => (
                    <div
                        key={pageIdx}
                        className="bg-white border-4 border-black p-8 mb-8"
                        style={{ minHeight: "1100px" }} // Approximate A4 ratio height
                    >
                        <div className="font-bangers text-xl text-gray-400 text-right mb-4">
                            PAGE {pageIdx + 1}
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {page.panels.map((panel, pIdx) => (
                                <div key={pIdx} className="relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-gray-100 overflow-hidden">
                                    {panel.imageUrl && (
                                        <img
                                            src={panel.imageUrl}
                                            alt={panel.description}
                                            className="w-full h-auto object-cover"
                                            crossOrigin="anonymous"
                                        />
                                    )}
                                    {panel.caption && (
                                        <div className="absolute top-0 left-0 bg-yellow-300 border-b-2 border-r-2 border-black p-2 max-w-[80%]">
                                            <p className="font-bold text-sm uppercase tracking-wide leading-tight">
                                                {panel.caption}
                                            </p>
                                        </div>
                                    )}
                                    {panel.speechBubbles?.map((bubble, bIdx) => (
                                        <div
                                            key={bIdx}
                                            className={`absolute p-3 bg-white border-2 border-black rounded-[50%] shadow-md max-w-[200px] text-center
                                                ${bIdx % 2 === 0 ? 'bottom-4 left-4 rounded-bl-none' : 'bottom-4 right-4 rounded-br-none'}
                                            `}
                                        >
                                            <p className="font-bangers text-xs text-rose-600 mb-1">{bubble.character}</p>
                                            <p className="text-xs font-bold leading-tight">{bubble.text}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
