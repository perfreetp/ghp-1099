export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/tasks/index',
    'pages/map/index',
    'pages/inspection/index',
    'pages/incident/index',
    'pages/profile/index',
    'pages/learning/index',
    'pages/incident-report/index',
    'pages/incident-detail/index',
    'pages/inspection-detail/index',
    'pages/emergency-plan/index',
    'pages/navigation/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#E63946',
    navigationBarTitleText: '微型消防站值勤助手',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F8F9FA'
  },
  tabBar: {
    color: '#8E8E8E',
    selectedColor: '#E63946',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/inspection/index',
        text: '检查'
      },
      {
        pagePath: 'pages/incident/index',
        text: '事件'
      },
      {
        pagePath: 'pages/map/index',
        text: '地图'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
})
