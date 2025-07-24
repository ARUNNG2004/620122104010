import React, { useState } from 'react';

import axios from 'axios';

const CreateShortUrl = () => {
    const [url, setUrl] = useState('');
    const [shortcode, setShortcode] = useState('');


    const [validity, setValidity] = useState(30);
    const [result, setResult] = useState(null);


    const [error, setError] = useState('');

    const isValidURL = (input) => {
        try {
            new URL(input);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleCreate = async () => {
        setError('');
        setResult(null);

        if (!url || !isValidURL(url)) {
            setError('Enter valid URL (e.g., https://example.com)');
            return;
        }

        try {
                const currentLocation = window.location.href;
            const response = await axios.post('http://localhost:5000/api/shorturls', {
                url,
                shortcode: shortcode.trim() || undefined,
                validity: Number(validity),
                referrer: currentLocation,
            });
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Server error');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCreate();
        }
    };

    return (
        <div className="card">
            <h2>Create Short URL</h2>
            <input
                type="text"
                placeholder="Original URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <input
                type="text"
                placeholder="Custom shortcode (optional)"
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <input
                type="number"
                placeholder="Validity in minutes (default 30)"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleCreate}>Shorten</button>

            {result && (
                <div className="result">
                    <p>
                        <strong>Short Link:</strong>{' '}
                        <a href={result.shortLink} target="_blank" rel="noreferrer">
                            {result.shortLink}
                        </a>
                    </p>
                    <p>
                        <strong>Expires At:</strong>{' '}
                        {new Date(result.expiry).toLocaleString()}
                    </p>
                </div>
            )}

            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CreateShortUrl;
