import React, { useState, useEffect } from 'react'
import { 
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Button,
  Input,
  Text,
  Dropdown,
  Option,
  MessageBar,
  MessageBarBody,
  Spinner
} from '@fluentui/react-components'
import { 
  VideoRegular,
  WeatherSunnyRegular,
  WeatherMoonRegular
} from '@fluentui/react-icons'
import VideoPlayer from './components/VideoPlayer.jsx'
import apiConfig from './config/apiConfig.json'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedApi, setSelectedApi] = useState(apiConfig.apis[0].id)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  // 检测系统主题
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(mediaQuery.matches)
    
    const handleChange = (e) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('video-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const addToHistory = (url, apiName) => {
    const newItem = {
      id: Date.now(),
      url,
      apiName,
      timestamp: new Date().toLocaleString()
    }
    
    const updatedHistory = [newItem, ...history.filter(item => item.url !== url)].slice(0, 10)
    setHistory(updatedHistory)
    localStorage.setItem('video-history', JSON.stringify(updatedHistory))
  }

  const handlePlayVideo = () => {
    if (!videoUrl.trim()) {
      setErrorMessage('请输入有效的视频链接')
      return
    }

    try {
      new URL(videoUrl)
    } catch {
      setErrorMessage('请输入有效的视频链接格式')
      return
    }

    setErrorMessage('')
    setIsLoading(true)
    
    const currentApi = getCurrentApi()
    addToHistory(videoUrl, currentApi?.name || '未知接口')
    
    setTimeout(() => {
      setIsLoading(false)
      setIsPlaying(true)
    }, 800)
  }

  const handleHistorySelect = (historyItem) => {
    setVideoUrl(historyItem.url)
    setShowHistory(false)
  }

  const handleBackToHome = () => {
    setIsPlaying(false)
    setVideoUrl('')
    setErrorMessage('')
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const getCurrentApi = () => {
    return apiConfig.apis.find(api => api.id === selectedApi)
  }

  return (
    <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>
      <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
        {/* 主题切换按钮 */}
        <div className="theme-toggle">
          <Button
            appearance="subtle"
            icon={isDarkMode ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
            onClick={toggleTheme}
            title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
          />
        </div>

        {!isPlaying ? (
          // 首页界面
          <div className="home-container">
            <div className="home-content">
              {/* 标题 */}
              <div className="title-section">
                <VideoRegular style={{ fontSize: 48, color: '#0078d4' }} />
                <Text size={900} weight="bold" className="app-title">
                  视频在线解析播放
                </Text>
                <Text size={400} className="app-subtitle">
                  支持解析播放优酷、爱奇艺、腾讯、芒果、乐视、搜狐、B站等视频
                </Text>
              </div>

              {/* 输入表单 */}
              <div className="form-container">
                <div className="form-content">
                  <div className="input-group">
                    <div className="input-header">
                      <Text size={300} weight="medium">视频链接</Text>
                      {history.length > 0 && (
                        <Button
                          appearance="subtle"
                          size="small"
                          onClick={() => setShowHistory(!showHistory)}
                        >
                          {showHistory ? '隐藏历史' : '历史记录'}
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="请输入视频链接（如：https://v.youku.com/...）"
                      value={videoUrl}
                      onChange={(_, data) => setVideoUrl(data.value)}
                      className="url-input"
                      size="large"
                    />
                    {showHistory && history.length > 0 && (
                      <div className="history-list">
                        {history.map(item => (
                          <div
                            key={item.id}
                            className="history-item"
                            onClick={() => handleHistorySelect(item)}
                          >
                            <div className="history-url">{item.url}</div>
                            <div className="history-meta">
                              <span className="history-api">{item.apiName}</span>
                              <span className="history-time">{item.timestamp}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="dropdown-group">
                    <Text size={300} weight="medium">选择解析接口</Text>
                    <Dropdown
                      value={apiConfig.apis.find(api => api.id === selectedApi)?.name || ''}
                      onOptionSelect={(_, data) => setSelectedApi(data.optionValue)}
                      className="api-dropdown"
                      placeholder="请选择解析接口"
                    >
                      {apiConfig.apis.map(api => (
                        <Option key={api.id} value={api.id}>
                          {api.name}
                        </Option>
                      ))}
                    </Dropdown>
                  </div>

                  {errorMessage && (
                    <MessageBar intent="error">
                      <MessageBarBody>{errorMessage}</MessageBarBody>
                    </MessageBar>
                  )}

                  <div className="button-group">
                    {isLoading ? (
                      <Spinner label="正在加载..." />
                    ) : (
                      <Button
                        appearance="primary"
                        size="large"
                        onClick={handlePlayVideo}
                        className="play-button"
                      >
                        开始播放
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // 播放界面
          <div className="player-container">
            <VideoPlayer
              videoUrl={videoUrl}
              apiUrl={getCurrentApi()?.url || ''}
              onBack={handleBackToHome}
            />
          </div>
        )}



        {/* 页脚 */}
        <footer className="app-footer">
          <Text size={200}>
            所有资源均来自互联网公开接口，仅供学习交流使用
          </Text>
        </footer>
      </div>
    </FluentProvider>
  )
}

export default App