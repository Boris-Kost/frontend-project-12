import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  const { t } = useTranslation()
  return (
    <div className="text-center">
      <h1 className="display-1">{t('notFound.header')}</h1>
      <p className="lead">{t('notFound.message')}</p>
      <Link to="/">{t('notFound.link')}</Link>
    </div>
  )
}

export default NotFoundPage
