export default function Item() {

    const item = {
        title: "Item Title",
        description: "Item description goes here.",
        date: new Date(),
        duration: null, 
        reoccuring: false,
        shared: false,
        complete: false,
        complete_datetime: null,
        complete_message: null,
        color: null, 
    };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold text-gray-800">Item Title</h2>
      <p className="text-gray-600">Item description goes here.</p>
    </div>
  );
}
