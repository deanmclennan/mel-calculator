import { useState, useEffect } from 'react';

const MEL_CATEGORIES = {
  'A': {
    name: 'Category A',
    description: 'Items required for safe operation',
    repairTime: 'Per MEL Remarks/Exceptions (Column 5)',
    repairHours: 'Variable',
    operationalLimit: 'Must be repaired within specified time in MEL',
    color: 'bg-red-100 border-red-500 text-red-800',
    note: 'Time interval excludes day of discovery for calendar/flight days'
  },
  'B': {
    name: 'Category B',
    description: 'Items with operational and/or maintenance relief',
    repairTime: '3 consecutive calendar days',
    repairHours: '72 hours',
    operationalLimit: 'Repair required within 3 calendar days',
    color: 'bg-orange-100 border-orange-500 text-orange-800',
    note: 'Excludes day of discovery - begins at midnight UTC on discovery day'
  },
  'C': {
    name: 'Category C',
    description: 'Items with operational relief',
    repairTime: '10 consecutive calendar days',
    repairHours: '240 hours',
    operationalLimit: 'Repair required within 10 calendar days',
    color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    note: 'Excludes day of discovery - begins at midnight UTC on discovery day'
  },
  'D': {
    name: 'Category D',
    description: 'Items with extended operational relief',
    repairTime: '120 consecutive calendar days',
    repairHours: '2880 hours',
    operationalLimit: 'Repair required within 120 calendar days',
    color: 'bg-green-100 border-green-500 text-green-800',
    note: 'Excludes day of discovery - begins at midnight UTC on discovery day'
  }
};

function App() {
  const [discoveryDate, setDiscoveryDate] = useState('');
  const [discoveryTime, setDiscoveryTime] = useState('');
  const [categoryADays, setCategoryADays] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for live calculations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Set default discovery date/time to current UTC time
  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // Already UTC
    const timeStr = now.toISOString().split('T')[1].substring(0, 5); // UTC time from ISO string
    
    if (!discoveryDate) setDiscoveryDate(dateStr);
    if (!discoveryTime) setDiscoveryTime(timeStr);
  }, []);

  const calculateRepairDeadline = (category, discoveryDateTime) => {
    if (!discoveryDateTime) return null;

    // Parse as UTC directly
    const discovery = new Date(discoveryDateTime);
    const discoveryUTC = discovery;
    
    // Set to midnight UTC of the discovery day (start of interval)
    const startOfInterval = new Date(discoveryUTC);
    startOfInterval.setUTCHours(0, 0, 0, 0);
    
    let deadline = new Date(startOfInterval);
    
    switch (category) {
      case 'A':
        if (!categoryADays || categoryADays === '') {
          return {
            deadline: 'Enter repair interval below',
            deadlineDate: null,
            example: 'Specify days per MEL Remarks/Exceptions Column 5',
            calculation: 'Custom interval based on specific equipment requirements',
            timeRemaining: 'Enter days to calculate',
            needsInput: true
          };
        }
        deadline.setUTCDate(deadline.getUTCDate() + parseInt(categoryADays));
        deadline.setUTCHours(23, 59, 59, 999);
        break;
      case 'B':
        deadline.setUTCDate(deadline.getUTCDate() + 3);
        deadline.setUTCHours(23, 59, 59, 999); // End at end of day UTC
        break;
      case 'C':
        deadline.setUTCDate(deadline.getUTCDate() + 10);
        deadline.setUTCHours(23, 59, 59, 999);
        break;
      case 'D':
        deadline.setUTCDate(deadline.getUTCDate() + 120);
        deadline.setUTCHours(23, 59, 59, 999);
        break;
    }

    const timeRemaining = deadline - currentTime;
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60));

    let timeRemainingStr = '';
    if (timeRemaining <= 0) {
      timeRemainingStr = 'EXPIRED';
    } else if (daysRemaining > 1) {
      timeRemainingStr = `${daysRemaining} days remaining`;
    } else {
      timeRemainingStr = `${hoursRemaining} hours remaining`;
    }

    const deadlineStr = deadline.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    // Format discovery time ensuring 24-hour format by using the original input string
    const discoveryStr = discoveryDateTime.replace('T', ' ').replace('.000Z', '').replace('Z', '') + ' UTC';
    
    return {
      deadline: deadlineStr,
      deadlineDate: deadline,
      example: `Discovery: ${discoveryStr} → Deadline: ${deadlineStr}`,
      calculation: `Interval begins at midnight UTC on ${startOfInterval.toISOString().substring(0, 10)}`,
      timeRemaining: timeRemainingStr,
      isExpired: timeRemaining <= 0
    };
  };

  const getCalculationsForAllCategories = () => {
    if (!discoveryDate || !discoveryTime) return {};
    
    const discoveryDateTime = `${discoveryDate}T${discoveryTime}:00.000Z`;
    const results = {};
    
    ['A', 'B', 'C', 'D'].forEach(category => {
      results[category] = calculateRepairDeadline(category, discoveryDateTime);
    });
    
    return results;
  };

  const allCalculations = getCalculationsForAllCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            MEL Category Calculator
          </h1>
          <p className="text-gray-600">
            Live calculation of MEL category repair deadlines
          </p>
        </div>

        {/* Discovery Date/Time Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Malfunction Discovery Time</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter the date and time when the malfunction was discovered to see live repair deadlines for all MEL categories
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discovery Date (UTC)
                </label>
                <input
                  type="date"
                  value={discoveryDate}
                  onChange={(e) => setDiscoveryDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discovery Time (UTC)
                </label>
                <input
                  type="time"
                  value={discoveryTime}
                  onChange={(e) => setDiscoveryTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category A Custom Repair Interval (Optional)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="365"
                    value={categoryADays}
                    onChange={(e) => setCategoryADays(e.target.value)}
                    placeholder="Enter days"
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-600">days</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the repair interval specified in MEL Remarks/Exceptions Column 5 for Category A items
                </p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Current time: {currentTime.toISOString().replace('T', ' ').substring(0, 16)} UTC
            </div>
          </div>
        </div>

        {/* MEL Categories Reference */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">MEL Categories</h3>
            <div className="space-y-3">
              {Object.entries(MEL_CATEGORIES).map(([key, category]) => {
                const calculation = allCalculations[key];
                const isExpired = calculation?.isExpired;
                const borderColor = isExpired ? 'border-red-600 bg-red-50' : category.color;
                
                return (
                  <div key={key} className={`p-4 rounded border-2 ${borderColor} relative`}>
                    <div className="font-medium text-lg">{category.name}</div>
                    <div className="text-sm mt-1">{category.description}</div>
                    <div className="text-xs mt-2">
                      <div><strong>Standard Time:</strong> {category.repairTime} ({category.repairHours})</div>
                      <div className="mt-1 italic opacity-75">{category.note}</div>
                    </div>
                    
                    {calculation && discoveryDate && discoveryTime && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-900 mb-2">Live Calculation</div>
                        {key === 'A' ? (
                          <div className="space-y-1 text-xs">
                            {calculation.needsInput ? (
                              <div className="text-orange-600">
                                <div><strong>Status:</strong> {calculation.deadline}</div>
                                <div className="italic">{calculation.calculation}</div>
                                <div className="mt-2 text-blue-600">
                                  ↑ Enter repair interval above to calculate deadline
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className={`font-medium ${isExpired ? 'text-red-700' : 'text-gray-700'}`}>
                                  <strong>Deadline:</strong> {calculation.deadline}
                                </div>
                                <div className={`font-bold text-sm ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                                  {calculation.timeRemaining}
                                </div>
                                <div className="text-gray-500 italic">
                                  {categoryADays} day interval per MEL specification
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-1 text-xs">
                            <div className={`font-medium ${isExpired ? 'text-red-700' : 'text-gray-700'}`}>
                              <strong>Deadline:</strong> {calculation.deadline}
                            </div>
                            <div className={`font-bold text-sm ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                              {calculation.timeRemaining}
                            </div>
                            <div className="text-gray-500 italic">{calculation.calculation}</div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {isExpired && (key !== 'A' || (key === 'A' && categoryADays)) && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                          EXPIRED
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="mt-4 p-3 bg-gray-50 rounded border text-xs text-gray-600">
                <div className="font-medium mb-2">MEL Repair Interval Rules:</div>
                <ul className="space-y-1">
                  <li>• Day of discovery is excluded from calendar day calculations</li>
                  <li>• Time intervals begin at midnight UTC on discovery day</li>
                  <li>• Category A follows specific MEL Remarks/Exceptions</li>
                  <li>• All times calculated in UTC per aviation regulations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;