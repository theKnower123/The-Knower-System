import React from 'react';

interface Props {
  accounts: { data: any[] };
}
export default function Accounts({ accounts }: Props) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Social Accounts</h1>
      {/* TODO: reuse your existing DataTable component here, same pattern as HrEmployees.tsx */}
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left p-2">Platform</th>
            <th className="text-left p-2">Handle</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {accounts.data.map((a) => (
            <tr key={a.id}>
              <td className="p-2">{a.platform}</td>
              <td className="p-2">{a.handle}</td>
              <td className="p-2">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
