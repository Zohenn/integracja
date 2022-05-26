using System;
using System.Collections.Generic;
using System.ServiceModel;
using Backend.Entities;

namespace Backend.Services
{
    [ServiceContract]
    public interface INaturalGasService: IBaseResourceService
    {
        [OperationContract]
        public List<NaturalGas> All();

        [OperationContract]
        public List<NaturalGas> GetDateRange(DateTime startDate, DateTime endDate);
    }
}
