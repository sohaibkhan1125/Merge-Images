import React from 'react';
import { Helmet } from 'react-helmet-async';

const siteUrl = 'https://mergeimages.com'; // Change this to your actual domain

const SEO = ({
    title,
    description,
    canonical,
    ogType = 'website',
    ogImage
}) => {
    const fullTitle = title ? `${title} | Merge Images` : 'Merge Images - Free Online Image Merger';
    const defaultDescription = 'Merge JPG, PNG images into one file. Fast, free, and secure image merging tool. Convert to PDF, JPEG, or PNG format.';
    const currentDescription = description || defaultDescription;
    const currentCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
    const currentOgImage = ogImage || `${siteUrl}/logo512.png`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={currentDescription} />
            <link rel="canonical" href={currentCanonical} />

            {/* Open Graph tags */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={currentDescription} />
            <meta property="og:url" content={currentCanonical} />
            <meta property="og:image" content={currentOgImage} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={currentDescription} />
            <meta name="twitter:image" content={currentOgImage} />
        </Helmet>
    );
};

export default SEO;
