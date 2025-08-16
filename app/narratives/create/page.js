import Layout from '../../../components/Layout'
import DemoFlow from '../../../components/DemoFlow'

export default function CreateNarrative() {
  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header - Centered like first image */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Create Narrative</h1>
          
          {/* Toggle Buttons - Styled like first image */}
          <div className="inline-flex bg-gray-100 rounded-full p-1 mb-6">
            <button className="px-8 py-3 text-gray-600 rounded-full font-medium hover:text-gray-900 transition-colors">
              Curate
            </button>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium transition-colors">

              Narrative
            </button>
          </div>
        </div>

        {/* Demo Flow Component */}
        <div className="mb-8">
          {/* <h2 className="text-xl font-semibold text-gray-900 mb-6">Creating Narrative</h2> */}
          <DemoFlow />
        </div>

        {/* Preview Section */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">📄</div>
              <div className="text-gray-600">Creating...</div>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center">
            <div className="bg-gray-200 w-full h-full rounded flex items-center justify-center">
              <span className="text-gray-500">Preview Image</span>
            </div>
          </div>
        </div> */}
      </div>
    </Layout>
  )
}