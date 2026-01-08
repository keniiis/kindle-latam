'use client';

import { useState } from 'react';
import { X, Palette, Save, ArrowLeft, Instagram } from 'lucide-react';

// Definimos los colores disponibles
const COLORS = [
    { name: 'Amarillo', bg: 'bg-yellow-200' },
    { name: 'Azul', bg: 'bg-blue-300' },
    { name: 'Rosa', bg: 'bg-pink-300' },
    { name: 'Celeste', bg: 'bg-sky-200' },
    { name: 'Blanco', bg: 'bg-white' },
];

interface QuoteEditorModalProps {
    quote: string;
    title: string;
    author: string;
    onClose: () => void;
    // Aquí podrías añadir una función onSave que reciba el color seleccionado
    // onSave: (color: string) => void;
}

export default function QuoteEditorModal({
    quote,
    title,
    author,
    onClose,
}: QuoteEditorModalProps) {
    // Estado para controlar si se muestra el selector de color
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    // Estado para el color seleccionado actualmente (por defecto el primero)
    const [selectedColor, setSelectedColor] = useState(COLORS[1]);

    const handleSave = () => {
        console.log('Guardando con color:', selectedColor.name);
        // Aquí iría la lógica de guardado/descarga, similar a la que tenías
        // onSave(selectedColor.bg);
    };

    return (
        // Contenedor principal del modal: pantalla completa, fondo oscuro
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-900 text-white">

            {/* --- BARRA SUPERIOR --- */}
            <div className="flex justify-between items-center p-4 px-6 bg-zinc-900/50 backdrop-blur-md z-10">
                <span className="font-bold text-sm tracking-wide text-zinc-400 uppercase">Vista Previa</span>
                <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <X size={20} className="text-white" />
                </button>
            </div>

            {/* --- ÁREA DE PREVISUALIZACIÓN CENTRAL --- */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
                {/* Tarjeta de la cita */}
                <div
                    className={`w-full max-w-sm aspect-3/5 rounded-xl shadow-2xl p-8 flex flex-col justify-between text-slate-800 transition-colors duration-500 ${selectedColor.bg}`}
                    style={{ fontFamily: 'serif' }}
                >
                    {/* Header de la tarjeta */}
                    <div className="flex items-center gap-1 opacity-60">
                        <Instagram size={16} />
                        <span className="text-[10px] font-sans font-bold tracking-widest uppercase">Citando Ando</span>
                    </div>

                    {/* Texto de la cita */}
                    <div className="flex-1 flex items-center justify-center my-4">
                        <p className="text-xl sm:text-2xl leading-relaxed italic font-medium text-center">
                            "{quote}"
                        </p>
                    </div>

                    {/* Footer de la tarjeta */}
                    <div className="mt-4 pt-6 border-t border-slate-800/10">
                        <p className="text-sm font-bold uppercase tracking-wide">
                            {title}
                        </p>
                        <p className="text-xs opacity-75 mt-1">
                            {author}
                        </p>
                    </div>
                </div>
            </div>

            {/* --- BARRA INFERIOR DE CONTROLES --- */}
            <div className="bg-zinc-950 p-4 pt-6 rounded-t-2xl flex flex-col gap-6">

                {/* Selector de Colores (Solo visible si isColorPickerOpen es true) */}
                {isColorPickerOpen && (
                    <div className="flex justify-center gap-4 animate-in slide-in-from-bottom-4 fade-in">
                        {COLORS.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color)}
                                className={`
                  w-10 h-10 rounded-full ring-2 ring-offset-2 ring-offset-zinc-950 transition-all
                  ${color.bg}
                  ${selectedColor.name === color.name ? 'ring-white scale-110' : 'ring-transparent opacity-80 hover:opacity-100 hover:scale-105'}
                `}
                                aria-label={`Seleccionar color ${color.name}`}
                            />
                        ))}
                    </div>
                )}

                {/* Botones de Acción Principal */}
                <div className="flex justify-around items-end text-xs font-medium text-zinc-400">

                    {/* Botón "color" */}
                    <button
                        onClick={() => setIsColorPickerOpen(true)}
                        className={`flex flex-col items-center gap-1 ${isColorPickerOpen ? 'text-white' : 'hover:text-white'} transition-colors`}
                    >
                        <Palette size={24} strokeWidth={1.5} />
                        <span>color</span>
                    </button>

                    {/* Botón dinámico: "Guardar" o "Volver" */}
                    {isColorPickerOpen ? (
                        <button
                            onClick={() => setIsColorPickerOpen(false)}
                            className="flex flex-col items-center gap-1 hover:text-white transition-colors animate-in fade-in"
                        >
                            <ArrowLeft size={24} strokeWidth={1.5} />
                            <span>Volver</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="flex flex-col items-center gap-1 hover:text-white transition-colors animate-in fade-in"
                        >
                            <Save size={24} strokeWidth={1.5} />
                            <span>Guardar</span>
                        </button>
                    )}

                </div>
            </div>

        </div>
    );
}