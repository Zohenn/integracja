using Backend.Entities;
using System;
using System.Collections.Generic;
using System.ServiceModel;

namespace Backend.Services
{
    [ServiceContract]
    public interface IConflictService
    {
        [OperationContract]
        public List<Conflict> All();

        [OperationContract]
        public Conflict? GetById(int id);

        [OperationContract]
        public List<Conflict> GetDateRange(DateTime startDate, DateTime endDate);
    }
}
