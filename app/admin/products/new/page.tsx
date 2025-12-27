'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { generateSlug } from '@/lib/utils';

const categories = [
    { value: 'sandals', label: 'Sandals' },
    { value: 'clogs', label: 'Clogs' },
    { value: 'slides', label: 'Slides' },
    { value: 'boots', label: 'Boots' },
];

const defaultSizes = [38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
const defaultColors = ['Black', 'Brown', 'Tan', 'White', 'Navy', 'Gray'];

export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        category: 'sandals',
        stock: '0',
        featured: false,
        model3dUrl: '',
    });

    const [images, setImages] = useState<string[]>(['']);
    const [sizes, setSizes] = useState<number[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'name' ? { slug: generateSlug(value) } : {}),
        }));
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const addImage = () => setImages([...images, '']);
    const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

    const toggleSize = (size: number) => {
        setSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };

    const toggleColor = (color: string) => {
        setColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
        );
    };

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag('');
        }
    };

    const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const productData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                price: parseFloat(formData.price),
                images: images.filter((img) => img.trim()),
                model3dUrl: formData.model3dUrl || null,
                sizes,
                colors,
                category: formData.category,
                stock: parseInt(formData.stock),
                featured: formData.featured,
                tags,
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (res.ok) {
                router.push('/admin/products');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to create product');
            }
        } catch {
            setError('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 text-[var(--gray-600)] hover:text-[var(--primary-500)] mb-6"
            >
                <ChevronLeft size={18} />
                Back to Products
            </Link>

            <h1 className="text-2xl font-bold text-[var(--gray-900)] mb-6">Add New Product</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
                        <h2 className="font-semibold text-lg mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    className="w-full px-4 py-2.5 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Price ($)"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Stock"
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Select
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                options={categories}
                            />
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-4 h-4"
                                />
                                <span>Featured product</span>
                            </label>
                        </div>
                    </div>

                    {/* Images & 3D */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
                            <h2 className="font-semibold text-lg mb-4">Images</h2>
                            <div className="space-y-3">
                                {images.map((img, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            placeholder="Image URL"
                                            value={img}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                        />
                                        {images.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X size={18} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addImage}>
                                    <Plus size={18} />
                                    Add Image
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
                            <h2 className="font-semibold text-lg mb-4">3D Model (Optional)</h2>
                            <Input
                                placeholder="GLB/GLTF URL"
                                name="model3dUrl"
                                value={formData.model3dUrl}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Sizes & Colors */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
                        <h2 className="font-semibold text-lg mb-4">Sizes (EU)</h2>
                        <div className="flex flex-wrap gap-2">
                            {defaultSizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`px-4 py-2 rounded-lg border transition-colors ${sizes.includes(size)
                                            ? 'bg-[var(--primary-500)] text-white border-transparent'
                                            : 'border-[var(--gray-300)] hover:border-[var(--primary-500)]'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
                        <h2 className="font-semibold text-lg mb-4">Colors</h2>
                        <div className="flex flex-wrap gap-2">
                            {defaultColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => toggleColor(color)}
                                    className={`px-4 py-2 rounded-lg border transition-colors ${colors.includes(color)
                                            ? 'bg-[var(--primary-500)] text-white border-transparent'
                                            : 'border-[var(--gray-300)] hover:border-[var(--primary-500)]'
                                        }`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-xl border border-[var(--gray-200)] p-6">
                    <h2 className="font-semibold text-lg mb-4">Tags</h2>
                    <div className="flex gap-2 mb-3">
                        <Input
                            placeholder="Add a tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" variant="outline" onClick={addTag}>
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--gray-100)] rounded-full text-sm"
                            >
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)}>
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" size="lg" isLoading={isSubmitting}>
                        Create Product
                    </Button>
                    <Link href="/admin/products">
                        <Button type="button" variant="outline" size="lg">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
