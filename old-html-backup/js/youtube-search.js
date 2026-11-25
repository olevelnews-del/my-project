/**
 * HSC Academic Hub - YouTube Search System
 * Generate dynamic YouTube search URLs for any chapter
 * Brand: hsctutorbd.com | WhatsApp: 01616200174
 */

(function(window) {
    'use strict';

    /**
     * Generate a YouTube search URL for a specific chapter
     * @param {string} subjectEnglish - English subject name (e.g., "Physics", "Bangla")
     * @param {string} chapterBangla - Bangla chapter name (e.g., "ভেক্টর", "অপরিচিতা")
     * @param {string} chapterEnglish - English chapter name (optional, e.g., "Vector", "Oporichita")
     * @returns {string} YouTube search results URL
     */
    function getYoutubeSearchUrl(subjectEnglish, chapterBangla, chapterEnglish) {
        var query = "HSC " + subjectEnglish + " " + chapterBangla;
        if (chapterEnglish) {
            query += " " + chapterEnglish;
        }
        query += " full class bangla";
        
        // Encode the query for URL safety while preserving Bengali characters
        return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
    }

    /**
     * Get video embed URL from links.json if available, otherwise fallback to search
     * @param {object} links - The links.json data
     * @param {string} subject - Subject key (lowercase)
     * @param {string} chapterKey - Chapter identifier
     * @returns {object} { embedUrl: string|null, hasVideo: boolean }
     */
    function getVideoOrNull(links, subject, chapterKey) {
        if (!links || !links.videos) return { embedUrl: null, hasVideo: false };
        
        var vidKey = subject.toLowerCase().replace(/[^a-z]/g, '') + '-ch' + chapterKey;
        var videoEntry = links.videos[vidKey];
        
        if (videoEntry && videoEntry.youtubeUrl && videoEntry.youtubeUrl !== '') {
            // Convert watch URL to embed URL
            var match = videoEntry.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (match) {
                return { embedUrl: 'https://www.youtube.com/embed/' + match[1], hasVideo: true };
            }
        }
        
        return { embedUrl: null, hasVideo: false };
    }

    /**
     * Create HTML for a YouTube search button
     * @param {string} subjectEnglish - Subject in English
     * @param {string} chapterBangla - Chapter in Bangla
     * @param {string} chapterEnglish - Chapter in English (optional)
     * @param {string} btnText - Custom button text
     * @returns {string} HTML button element
     */
    function createYoutubeSearchButton(subjectEnglish, chapterBangla, chapterEnglish, btnText) {
        var url = getYoutubeSearchUrl(subjectEnglish, chapterBangla, chapterEnglish);
        var label = btnText || '▶ YouTube-এ এই অধ্যায়ের সব ক্লাস দেখো';
        return '<a href="' + url + '" target="_blank" rel="noopener noreferrer" ' +
               'class="youtube-search-btn" style="display:inline-block;padding:12px 20px;background:linear-gradient(135deg,#FF0000,#CC0000);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;margin-top:12px;">' +
               label + '</a>';
    }

    /**
     * Render chapter cards with YouTube search fallback
     * @param {HTMLElement} container - Container element
     * @param {Array} chapters - Array of {bangla, english} objects
     * @param {string} subjectEnglish - Subject name in English
     */
    function renderChapterCards(container, chapters, subjectEnglish) {
        if (!container || !chapters) return;
        
        container.innerHTML = '';
        
        chapters.forEach(function(ch, idx) {
            var card = document.createElement('div');
            card.className = 'chapter-card youtube-fallback';
            card.style.cssText = 'background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:12px;padding:16px;margin-bottom:12px;transition:transform 0.2s ease;';
            
            card.innerHTML = 
                '<h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin:0 0 8px 0;">অধ্যায় ' + (idx+1) + ': ' + ch.bangla + '</h3>' +
                '<p style="font-size:12px;color:var(--text-muted);margin:0 0 12px 0;">' + (ch.english || subjectEnglish + ' Chapter ' + (idx+1)) + '</p>' +
                createYoutubeSearchButton(subjectEnglish, ch.bangla, ch.english) +
                ' <span style="font-size:12px;color:var(--text-muted);">ও</span><br>' +
                createYoutubeSearchButton(subjectEnglish, ch.bangla, ch.english, '🔍 YouTube-এ আরও ভিডিও খুঁজো');
            
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
            
            container.appendChild(card);
        });
    }

    // Export to window
    window.YoutubeSearchSystem = {
        getYoutubeSearchUrl: getYoutubeSearchUrl,
        getVideoOrNull: getVideoOrNull,
        createYoutubeSearchButton: createYoutubeSearchButton,
        renderChapterCards: renderChapterCards,
        
        // Pre-defined subject chapter mappings
        CHAPTERS: {
            'bangla': [
                {bangla: 'ব্যালকরণ', english: 'Grammar'},
                {bangla: 'গদ্য', english: 'Prose'},
                {bangla: 'পদ্য', english: 'Poetry'},
                {bangla: 'নাটক', english: 'Drama'},
                {bangla: 'উপন্যাস', english: 'Novel'},
                {bangla: 'সাহিত্য_ইতিহাস', english: 'Literature History'}
            ],
            'english': [
                {bangla: 'Grammar', english: 'Grammar'},
                {bangla: 'Comprehension', english: 'Reading Comprehension'},
                {bangla: 'Writing', english: 'Writing Skills'},
                {bangla: 'Literature', english: 'Literature'},
                {bangla: 'Translation', english: 'Translation'}
            ],
            'physics': [
                {bangla: 'ভৌত জগৎ ও পরিমাপ', english: 'Physical World & Measurement'},
                {bangla: 'ভেক্টর', english: 'Vector'},
                {bangla: 'গতিবিদ্যা', english: 'Dynamics'},
                {bangla: 'নিউটনীয় বলবিদ্যা', english: 'Newtonian Mechanics'},
                {bangla: 'কাজ শক্তি ক্ষমতা', english: 'Work Energy Power'},
                {bangla: 'মহাকর্ষ ও অভিকর্ষ', english: 'Gravitation'},
                {bangla: 'পদার্থের গাঠনিক ধর্ম', english: 'Elasticity'},
                {bangla: 'পর্যাবৃত্তিক গতি', english: 'Periodic Motion'},
                {bangla: 'তরঙ্গ', english: 'Waves'},
                {bangla: 'আদর্শ গ্যাস', english: 'Ideal Gas'}
            ],
            'chemistry': [
                {bangla: 'লেবরেটরির নিরাপদ ব্যবহার', english: 'Lab Safety'},
                {bangla: 'গুণগত রসায়ন', english: 'Qualitative Chemistry'},
                {bangla: 'মৌলের পর্যায়বৃত্ত ধর্ম', english: 'Periodic Properties'},
                {bangla: 'রাসায়নিক বন্ধন', english: 'Chemical Bonding'},
                {bangla: 'রাসায়নিক পরিবর্তন', english: 'Chemical Changes'}
            ],
            'biology': [
                {bangla: 'কোষ ও এর গঠন', english: 'Cell Structure'},
                {bangla: 'কোষ বিভাজন', english: 'Cell Division'},
                {bangla: 'কোষ রসায়ন', english: 'Cell Chemistry'},
                {bangla: 'অণুজীব', english: 'Microorganisms'},
                {bangla: 'শৈবাল ও ছত্রাক', english: 'Algae & Fungi'}
            ],
            'math': [
                {bangla: 'ম্যাট্রিক্স ও নির্ণায়ক', english: 'Matrix & Determinant'},
                {bangla: 'ভেক্টর', english: 'Vector'},
                {bangla: 'সরলরেখা', english: 'Straight Line'},
                {bangla: 'বৃত্ত', english: 'Circle'},
                {bangla: 'বিন্যাস ও সমাবেশ', english: 'Permutation Combination'},
                {bangla: 'ত্রিকোণমিতিক অনুপাত', english: 'Trigonometric Ratios'},
                {bangla: 'সংযুক্ত কোণের ত্রিকোণমিতি', english: 'Compound Angles'},
                {bangla: 'ফাংশন', english: 'Function'},
                {bangla: 'অন্তরীকরণ', english: 'Differentiation'},
                {bangla: 'যোগজীকরণ', english: 'Integration'}
            ],
            'ict': [
                {bangla: 'বিশ্ব ও বাংলাদেশ প্রেক্ষিতে', english: 'World & Bangladesh Context'},
                {bangla: 'কমিউনিকেশন সিস্টেম', english: 'Communication System'},
                {bangla: 'সংখ্যা পদ্ধতি ও ডিজিটাল ডিভাইস', english: 'Number Systems'},
                {bangla: 'ওয়েব ডিজাইন ও HTML', english: 'Web Design HTML'},
                {bangla: 'প্রোগ্রামিং ভাষা C', english: 'Programming C'},
                {bangla: 'ডেটাবেস ম্যানেজমেন্ট', english: 'Database Management'}
            ]
        }
    };

    console.log('[HSC Hub] YouTube Search System loaded');

})(window);
