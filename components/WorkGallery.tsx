
import React, { useState, useEffect, useRef } from 'react';
import {
    Camera, Upload, Image, Trash2, Plus, X, Check,
    Eye, ChevronLeft, ChevronRight, Sparkles, Clock,
    Star, ArrowRight
} from 'lucide-react';
import { User as UserType } from '../types';
import { db } from '../services/firebaseService';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';

interface GalleryItem {
    id: string;
    userId: string;
    userName: string;
    title: string;
    description: string;
    category: string;
    beforeImage: string;
    afterImage: string;
    createdAt: any;
}

interface WorkGalleryProps {
    user: UserType;
    addNotification: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

const CATEGORIES = [
    'Electrical Work',
    'Plumbing',
    'Painting',
    'Carpentry',
    'Cleaning',
    'Renovation',
    'Beauty',
    'Other'
];

const WorkGallery: React.FC<WorkGalleryProps> = ({ user, addNotification }) => {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    // Upload form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [beforeImage, setBeforeImage] = useState<string>('');
    const [afterImage, setAfterImage] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);

    const beforeInputRef = useRef<HTMLInputElement>(null);
    const afterInputRef = useRef<HTMLInputElement>(null);

    // Check if user is a professional
    if (user.role !== 'WORKER') {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 mb-2">Professional Feature Only</h3>
                    <p className="text-slate-500">Work Gallery is available only for professionals.</p>
                </div>
            </div>
        );
    }

    // Fetch gallery items from Firebase
    useEffect(() => {
        setIsLoading(true);
        const galleryRef = collection(db, 'workGallery');
        const q = query(galleryRef, where('userId', '==', user.id));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items: GalleryItem[] = [];
            snapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() } as GalleryItem);
            });
            // Sort by createdAt in memory
            items.sort((a, b) => {
                const aTime = a.createdAt?.seconds || 0;
                const bTime = b.createdAt?.seconds || 0;
                return bTime - aTime;
            });
            setGalleryItems(items);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching gallery:', error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user.id]);

    // Convert file to base64
    const handleImageUpload = (file: File, setter: (url: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setter(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Submit gallery item
    const handleSubmit = async () => {
        if (!title.trim() || !beforeImage || !afterImage) {
            addNotification('Missing Fields', 'Please fill in all required fields', 'warning');
            return;
        }

        setIsUploading(true);
        try {
            const galleryRef = collection(db, 'workGallery');
            await addDoc(galleryRef, {
                userId: user.id,
                userName: user.name,
                title,
                description,
                category,
                beforeImage,
                afterImage,
                createdAt: serverTimestamp()
            });

            addNotification('Success! 🎉', 'Your work has been added to the gallery', 'success');
            setShowUploadModal(false);
            resetForm();
        } catch (error) {
            console.error('Error uploading:', error);
            addNotification('Error', 'Failed to upload. Please try again.', 'warning');
        } finally {
            setIsUploading(false);
        }
    };

    // Delete gallery item
    const handleDelete = async (itemId: string) => {
        try {
            await deleteDoc(doc(db, 'workGallery', itemId));
            addNotification('Deleted', 'Work item removed from gallery', 'info');
            setSelectedItem(null);
        } catch (error) {
            console.error('Error deleting:', error);
            addNotification('Error', 'Failed to delete item', 'warning');
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('');
        setBeforeImage('');
        setAfterImage('');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Camera className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-black text-slate-900">Work Gallery</h1>
                    </div>
                    <p className="text-slate-500">Showcase your before/after transformations</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Work
                </button>
            </div>

            {/* Info Banner */}
            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-blue-900">Build Your Portfolio</p>
                        <p className="text-sm text-blue-700">
                            Upload before/after photos to showcase your skills. Clients can see your work quality!
                        </p>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">Loading gallery...</p>
                    </div>
                </div>
            )}

            {/* Gallery Grid */}
            {!isLoading && (
                <>
                    {galleryItems.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
                            <Image className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 mb-2">No work samples yet</h3>
                            <p className="text-slate-500 mb-6">Upload your first before/after photo to get started!</p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
                            >
                                <Upload className="w-5 h-5" />
                                Upload Photos
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
                                >
                                    {/* Image Comparison Preview */}
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 flex">
                                            <div className="w-1/2 relative overflow-hidden">
                                                <img
                                                    src={item.beforeImage}
                                                    alt="Before"
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                                                    BEFORE
                                                </div>
                                            </div>
                                            <div className="w-1/2 relative overflow-hidden">
                                                <img
                                                    src={item.afterImage}
                                                    alt="After"
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">
                                                    AFTER
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                                                <ArrowRight className="w-4 h-4 text-slate-600" />
                                            </div>
                                        </div>
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="px-4 py-2 bg-white rounded-xl shadow-lg">
                                                <Eye className="w-5 h-5 text-slate-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{item.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">{item.category}</span>
                                            <div className="flex items-center gap-1 text-slate-400 text-xs">
                                                <Clock className="w-3 h-3" />
                                                <span>Recently</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Stats */}
            {!isLoading && galleryItems.length > 0 && (
                <div className="mt-8 p-4 bg-slate-50 rounded-2xl text-center">
                    <p className="text-slate-600">
                        <span className="font-bold text-blue-600">{galleryItems.length}</span> work sample{galleryItems.length !== 1 ? 's' : ''} in your gallery
                    </p>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">Add Work Sample</h2>
                                <p className="text-sm text-slate-500">Upload before & after photos</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    resetForm();
                                }}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Project Title *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Kitchen Renovation"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select category</option>
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the work done..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            {/* Image Uploads */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Before Image */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Before Photo *
                                    </label>
                                    <input
                                        type="file"
                                        ref={beforeInputRef}
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                handleImageUpload(e.target.files[0], setBeforeImage);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => beforeInputRef.current?.click()}
                                        className={`aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center ${beforeImage
                                                ? 'border-green-300 bg-green-50'
                                                : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        {beforeImage ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={beforeImage}
                                                    alt="Before"
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                                                    BEFORE
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setBeforeImage('');
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                                                >
                                                    <X className="w-4 h-4 text-slate-600" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                                <span className="text-sm text-slate-500">Upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* After Image */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        After Photo *
                                    </label>
                                    <input
                                        type="file"
                                        ref={afterInputRef}
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                handleImageUpload(e.target.files[0], setAfterImage);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => afterInputRef.current?.click()}
                                        className={`aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center ${afterImage
                                                ? 'border-green-300 bg-green-50'
                                                : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                                            }`}
                                    >
                                        {afterImage ? (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={afterImage}
                                                    alt="After"
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-lg">
                                                    AFTER
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAfterImage('');
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                                                >
                                                    <X className="w-4 h-4 text-slate-600" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                                <span className="text-sm text-slate-500">Upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isUploading || !title || !beforeImage || !afterImage}
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${isUploading || !title || !beforeImage || !afterImage
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
                                    }`}
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Add to Gallery
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail View Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">{selectedItem.title}</h2>
                                <p className="text-sm text-slate-500">{selectedItem.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDelete(selectedItem.id)}
                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <img
                                        src={selectedItem.beforeImage}
                                        alt="Before"
                                        className="w-full rounded-2xl"
                                    />
                                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-xl">
                                        BEFORE
                                    </div>
                                </div>
                                <div className="relative">
                                    <img
                                        src={selectedItem.afterImage}
                                        alt="After"
                                        className="w-full rounded-2xl"
                                    />
                                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-green-500 text-white text-sm font-bold rounded-xl">
                                        AFTER
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedItem.description && (
                                <div className="mt-6 p-4 bg-slate-50 rounded-2xl">
                                    <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                                    <p className="text-slate-600">{selectedItem.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkGallery;
