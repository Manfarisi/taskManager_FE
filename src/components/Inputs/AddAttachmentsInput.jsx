import React, { useState } from 'react';
import { HiOutlineTrash, HiPaperClip, HiPlus } from 'react-icons/hi';

const AddAttachmentsInput = ({ attachments = [], setAttachments }) => {
    const [option, setOption] = useState("");

    // function to handle adding an option
    const handleAddOption = () => {
        if (option.trim()) {
            setAttachments([...attachments, option.trim()]);
            setOption("");
        }
    };

    // function to handle deleting an option
    const handleDeleteOption = (index) => {
        const updatedArr = attachments.filter((_, idx) => idx !== index);
        setAttachments(updatedArr);
    };

    return (
        <div className="space-y-4">

            {/* Daftar Attachments */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(attachments.length === 0 || !attachments) && (
                    <p className="text-gray-500 text-sm italic py-2">
                        No attachments have been added yet. (e.g., 'design-v2.pdf' or 'figma.link/project')
                    </p>
                )}

                {attachments.map((item, index) => (
                    <div
                        // Menggunakan index sebagai key karena item hanya string
                        key={index} 
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Ikon Paperclip Berwarna */}
                            <HiPaperClip className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            {/* Teks Attachment */}
                            <p 
                                className="text-sm font-medium text-gray-700 truncate"
                                title={item} // Tooltip untuk teks panjang
                            >
                                {item}
                            </p>
                        </div>

                        {/* Tombol Hapus dengan efek hover berwarna */}
                        <button
                            onClick={() => handleDeleteOption(index)}
                            className="text-red-500 hover:text-white hover:bg-red-600 transition-all duration-200 p-1.5 rounded-full cursor-pointer flex-shrink-0 ml-4"
                            title="Remove attachment"
                        >
                            <HiOutlineTrash className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Input Tambah Attachment */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                
                {/* Input Field Group */}
                <div className="flex items-center flex-1 border border-gray-300 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <HiPaperClip className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                    <input 
                        type="text" 
                        placeholder="Enter file name or URL link..." 
                        value={option} 
                        onChange={({ target }) => setOption(target.value)}
                        onKeyDown={(e) => { // Memungkinkan penambahan dengan tombol Enter
                            if (e.key === 'Enter') {
                                handleAddOption();
                            }
                        }}
                        className="flex-1 text-sm bg-transparent focus:outline-none"
                    />
                </div>

                {/* Tombol Add */}
                <button 
                    onClick={handleAddOption}
                    disabled={!option.trim()}
                    className="flex items-center gap-1 bg-green-600 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-md hover:bg-green-700 transition-all cursor-pointer disabled:bg-green-400 disabled:cursor-not-allowed"
                    title="Add attachment"
                > 
                    <HiPlus className="w-4 h-4" /> 
                    Add
                </button>
            </div>
        </div>
    );
};

export default AddAttachmentsInput;