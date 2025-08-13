import React, { useState, useEffect } from 'react'
import {
  Button
} from '@fluentui/react-components'
import {
  ArrowLeftRegular
} from '@fluentui/react-icons'
import './VideoPlayer.css'

const VideoPlayer = ({ videoUrl, apiUrl, onBack }) => {
  const [playerSrc, setPlayerSrc] = useState('')

  useEffect(() => {
    const fullUrl = apiUrl + encodeURIComponent(videoUrl)
    setPlayerSrc(fullUrl)
  }, [videoUrl, apiUrl])

  return (
    <div className="video-player">
      <div className="player-wrapper">
        <iframe
          src={playerSrc}
          className="video-iframe"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          title="视频播放器"
          sandbox="allow-same-origin allow-scripts allow-forms allow-presentation"
        />
      </div>

      <div className="player-controls">
        <Button
          appearance="subtle"
          icon={<ArrowLeftRegular />}
          onClick={onBack}
          className="control-button back-button"
        >
          返回首页
        </Button>
      </div>
    </div>
  )
};

export default VideoPlayer