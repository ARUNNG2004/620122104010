import React, { useState } from 'react';
import axios from 'axios';

const UrlStats = () => {
    const [shortcode, setShortcode] = useState('');
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        try {
            setError('');
            const res = await axios.get(`http://localhost:5000/api/shorturls/${shortcode}`);
            setStats(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching stats');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            fetchStats();
        }
    };

    return (
        <div className="card">
            <h2>View URL Stats</h2>
            <input
                type="text"
                placeholder="Enter shortcode"
                value={shortcode}
                onChange={(e) => setShortcode(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={fetchStats}>Get Stats</button>

            {stats && (
                <div className="result">
                    <p><strong>Original URL:</strong> {stats.longUrl}</p>
                    <p><strong>Created At:</strong> {new Date(stats.createdAt).toLocaleString()}</p>
                    <p><strong>Expires At:</strong> {new Date(stats.expiry).toLocaleString()}</p>
                    <p><strong>Total Clicks:</strong> {stats.clicks}</p>
                    <h4>Click Details:</h4>
                    <ul>
                        {stats.clickDetails.length > 0 ? stats.clickDetails.map((c, i) => (
                            <li key={i}>
                                {new Date(c.timestamp).toLocaleString()} - {c.referrer} - {c.location}
                            </li>
                        )) : <li>No clicks recorded.</li>}
                    </ul>
                </div>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default UrlStats;
