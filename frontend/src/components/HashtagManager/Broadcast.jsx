import React, { useState, useEffect, useCallback } from 'react';
import './Broadcast.css';
import config from '../../config';

const characters = [
  'sui', 'grum', 'stomp', 'blaze', 'brocco', 'yeti', 'nubb', 'nom',
  'cyclo', 'glint', 'fluff', 'captainboo', 'momo', 'slippy', 'whirl', 'twispy','pico','tuga', 'kai', 'ruk', 'pyro', 'grow', 'luna', 'floar','ecron'
];

const Broadcast = () => {
  const [requiredTags, setRequiredTags] = useState([]);
  const [optionalTags, setOptionalTags] = useState([]);
  const [tweetPersonality, setTweetPersonality] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [dynamicSentences, setDynamicSentences] = useState('');
  const [commentPersonality, setCommentPersonality] = useState('');
  const [selectedMedia, setSelectedMedia] = useState('images');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchMediaType = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/get-media-type`);
        if (response.ok) {
          const data = await response.json();
          setSelectedMedia(data.mediaType);
        }
      } catch (error) {
        console.error('Error fetching media type:', error);
      }
    };

    fetchMediaType();
  }, []);

  const handleBroadcast = async (type) => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaType: type }),
      });

      if (!response.ok) throw new Error('Broadcast failed');
      console.log(await response.json());
      setSelectedMedia(type);
    } catch (error) {
      console.error('Broadcast error:', error);
    } finally {
      setLoading(false);
    }
  };

  



  // Fetch character description when personality changes
  useEffect(() => {
    if (tweetPersonality) {
      fetchCharacterDescription(tweetPersonality);
    }
  }, [tweetPersonality]);

  const fetchCharacterDescription = async (character) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/characterdescription/${character}`);
      if (response.ok) {
        const data = await response.json();
        setCharacterDescription(data.description || '');
      } else {
        console.error('Failed to fetch character description');
        setCharacterDescription('');
      }
    } catch (error) {
      console.error('Error fetching character description:', error);
      setCharacterDescription('');
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch hashtags
      const hashtagsResponse = await fetch(`${config.API_BASE_URL}/hashtags`);
      if (hashtagsResponse.ok) {
        const hashtagsData = await hashtagsResponse.json();
        setRequiredTags(hashtagsData.requiredTags || []);
        setOptionalTags(hashtagsData.optionalTags || []);
      } else {
        console.error('Failed to fetch hashtags');
      }
  
      // Fetch tweet personality
      const tweetPersonalityResponse = await fetch(`${config.API_BASE_URL}/replypersonality`);
      if (tweetPersonalityResponse.ok) {
        const tweetPersonalityData = await tweetPersonalityResponse.json();
        setTweetPersonality(tweetPersonalityData.content || '');
        // Fetch description for initial personality
        if (tweetPersonalityData.content) {
          await fetchCharacterDescription(tweetPersonalityData.content);
        }
      } else {
        console.error('Failed to fetch tweet personality');
      }
  
      // Fetch dynamic sentences
      const dynamicSentencesResponse = await fetch(`${config.API_BASE_URL}/dynamicpersonality`);
      if (dynamicSentencesResponse.ok) {
        const dynamicSentencesData = await dynamicSentencesResponse.json();
        setDynamicSentences(dynamicSentencesData.content || []);
      } else {
        console.error('Failed to fetch dynamic sentences');
      }
  
      // Fetch comment personality
      const commentPersonalityResponse = await fetch(`${config.API_BASE_URL}/commentpersonality`);
      if (commentPersonalityResponse.ok) {
        const commentPersonalityData = await commentPersonalityResponse.json();
        setCommentPersonality(commentPersonalityData.content || '');
      } else {
        console.error('Failed to fetch comment personality');
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Ensures fetchData doesn't change on every render
  
  // Fetch data once on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]); // ✅ No infinite loop

  const updateHashtags = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/update-hashtags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requiredTags, optionalTags })
      });
      if (!response.ok) throw new Error('Failed to update hashtags');
      console.log(await response.json());
    } catch (error) {
      console.error('Error updating hashtags:', error);
    } finally {
      setLoading(false);
    }
  };

  // const updateTweetPersonality = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${config.API_BASE_URL}/character-description`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ 
  //         content: tweetPersonality,
  //         description: characterDescription 
  //       })
  //     });
  //     if (!response.ok) throw new Error('Failed to update tweet personality');
  //     console.log(await response.json());
  //   } catch (error) {
  //     console.error('Error updating tweet personality:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateTweetPersonality = async () => {
    setLoading(true);
    try {
      const tweetResponse = await fetch(`${config.API_BASE_URL}/updatereplypersonality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tweetPersonality }),
      });
  
      const characterResponse = await fetch(`${config.API_BASE_URL}/characterdescription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: tweetPersonality,
          description: characterDescription 
        }),
      });
  
      if (!tweetResponse.ok || !characterResponse.ok) {
        throw new Error('Failed to update tweet personality or character description');
      }
  
      console.log(await tweetResponse.json());
      console.log(await characterResponse.json());
    } catch (error) {
      console.error('Error updating tweet personality:', error);
    } finally {
      setLoading(false);
    }
  };
  

  // Rest of the existing functions remain the same...
  const updateCommentPersonality = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/updatecommentpersonality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentPersonality })
      });
      if (!response.ok) throw new Error('Failed to update comment personality');
      console.log(await response.json());
    } catch (error) {
      console.error('Error updating comment personality:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDynamicSentences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/updatedynamicpersonality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: dynamicSentences })
      });
      if (!response.ok) throw new Error('Failed to update dynamic sentences');
      console.log(await response.json());
    } catch (error) {
      console.error('Error updating dynamic sentences:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleBroadcast = async (type) => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${config.API_BASE_URL}/broadcast`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ mediaType: type })
  //     });
  //     if (!response.ok) throw new Error('Broadcast failed');
  //     console.log(await response.json());
  //     setSelectedMedia(type);
  //   } catch (error) {
  //     console.error('Broadcast error:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="dynamic-content">
      <h1>Dynamic Content</h1>
      <div className="content-container">
        <div className="left-section">
          <div className="parameters">
            <p>Below are the Dynamic Parameters which we can update:</p>
            <ol>
              <li>HashTags (Required and Optional)</li>
              <li>Personality of Agent when Replying to Tweets</li>
              <li>3 Dynamic Sentences that change every time</li>
              <li>Personality of Agent when Replying to Comments</li>
            </ol>
          </div>

          {/* Hashtags Section */}
          <div className="hashtags-section">
            <div className="hashtag-group">
              <h3>HashTags that Must be Present</h3>
              <input
                type="text"
                value={requiredTags.join(', ')}
                onChange={(e) => setRequiredTags(
                  e.target.value.split(',').map(tag => tag.trim())
                )}
              />
            </div>
            <div className="hashtag-group">
              <h3>HashTags that are Optional</h3>
              <input
                type="text"
                value={optionalTags.join(', ')}
                onChange={(e) => setOptionalTags(
                  e.target.value.split(',').map(tag => tag.trim())
                )}
              />
            </div>
            <button className="update-btn" onClick={updateHashtags} disabled={loading}>
              {loading ? 'Updating...' : 'Update HashTags'}
            </button>
          </div>

          {/* Personality Sections */}
          <div className="personality-sections">
            <div className="personality-group">
              <label>Agent Personality for Tweet Replies:</label>
              <select
                value={tweetPersonality}
                onChange={(e) => setTweetPersonality(e.target.value)}
              >
                {characters.map((character, index) => (
                  <option key={index} value={character}>{character}</option>
                ))}
              </select>
              <textarea
                value={characterDescription}
                onChange={(e) => setCharacterDescription(e.target.value)}
                placeholder="Enter character description..."
                className="character-description"
              />
              <button onClick={updateTweetPersonality} disabled={loading}>
                {loading ? 'Updating...' : 'Update Personality for Replying to Tweets'}
              </button>
            </div>

            <div className="personality-group">
              <textarea
                value={dynamicSentences}
                onChange={(e) => setDynamicSentences(e.target.value)}
                placeholder="3 Dynamic Sentences Response"
              />
              <button onClick={updateDynamicSentences} disabled={loading}>
                {loading ? 'Updating...' : 'Update 3 Sentences Dynamic Response'}
              </button>
            </div>

            <div className="personality-group">
              <textarea
                value={commentPersonality}
                onChange={(e) => setCommentPersonality(e.target.value)}
                placeholder="Agent Personality for People Comments"
              />
              <button onClick={updateCommentPersonality} disabled={loading}>
                {loading ? 'Updating...' : "Update Personality for Replying to People's Comments"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section - Broadcast */}
        <div className="right-section">
          <div className="broadcast-info">
            <p>Select one of the buttons below to broadcast either an image, a video, or an audio podcast.</p>
          </div>
          <div className="broadcast-buttons">
      {['images', 'videos', 'audios'].map((type) => (
        <button
          key={type}
          className={`broadcast-btn ${selectedMedia === type ? 'active green' : ''}`}
          onClick={() => handleBroadcast(type)}
          disabled={loading}
        >
          {loading ? 'Broadcasting...' : `Broadcast ${type.charAt(0).toUpperCase() + type.slice(1)}`}
        </button>
      ))}
    </div>
        </div>
      </div>
    </div>
  );
};

export default Broadcast;