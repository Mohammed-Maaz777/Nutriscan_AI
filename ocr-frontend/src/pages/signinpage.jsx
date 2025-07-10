import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, Mail, HeartPulse } from 'lucide-react';

function SignInPage({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    diabetes: false,
    allergies: [],
    gender: '',
  });

  const allergyOptions = [
    'Dairy', 'Gluten', 'Nuts', 'Soy', 'Skin-related', 'Shellfish'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'allergies') {
      const updated = checked
        ? [...form.allergies, value]
        : form.allergies.filter((item) => item !== value);
      setForm({ ...form, allergies: updated });
    } else {
      setForm({
        ...form,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('healthProfile', JSON.stringify(form));
    alert('Health details saved!');
    if (onSubmit) onSubmit(form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 max-w-lg w-full space-y-6"
      >
        <motion.h2
          className="text-3xl font-extrabold text-center text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="text-yellow-400" /> Welcome to Scan-to-Healthify
        </motion.h2>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Fill your health profile to personalize results
        </p>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
            <User className="w-4 h-4" /> Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Diabetes */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="diabetes"
            checked={form.diabetes}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-1">
            <HeartPulse className="w-4 h-4 text-red-500" /> I have diabetes
          </span>
        </label>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Allergies
          </label>
          <div className="grid grid-cols-2 gap-2">
            {allergyOptions.map((item) => (
              <label
                key={item}
                className="flex items-center bg-indigo-100 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-indigo-200 dark:hover:bg-gray-600"
              >
                <input
                  type="checkbox"
                  name="allergies"
                  value={item}
                  checked={form.allergies.includes(item)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-lg text-lg font-semibold hover:opacity-90 transition"
        >
          Save & Continue →
        </motion.button>
      </motion.form>
    </div>
  );
}

export default SignInPage;
