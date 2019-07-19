using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Data;
using System.Text;
using kinarti.Models;


public class DBservices
{
    public SqlDataAdapter da;
    private SqlConnection con;
    public DataTable dt;

    public DBservices()
    {
        // TODO: Add constructor logic here
        con = null;
}
    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the web.config 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {
        // read the connection string from the configuration file
        if (this.con != null)
        {
            return this.con;
            
        }
        string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }

    //--------------------------------------------------------------------------------------------------
    // This method inserts a material to the materials table 
    //--------------------------------------------------------------------------------------------------
    public int insertMaterial(Material material)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex) {
            throw (ex); // write to log
        }
        String cStr = BuildInsertMaterialCommand(material);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con); // create the command  
        try
        {
            int materialId = Convert.ToInt32(cmd.ExecuteScalar()); // execute the command
            return materialId;
        }
        catch (Exception ex) {
            throw (ex); // write to log
        }
        finally {
            if (this.con != null) {
                this.con.Close();// close the db connection
            }
        }
    }
    //--------------------------------------------------------------------
    // Build the Insert command String-person
    //--------------------------------------------------------------------
    private String BuildInsertMaterialCommand(Material material)
    {
        String command;
        StringBuilder sbMaterial = new StringBuilder();
        // use a string builder to create the dynamic string
        sbMaterial.AppendFormat("Values('{0}', {1}, {2}, {3})",
            material.Name, material.Type, material.Cost, material.Coefficient);
        String prefix = "INSERT INTO materialTbl " + "(name, type, cost, coefficient) ";
        command = prefix + sbMaterial.ToString() + ";" + "SELECT CAST(scope_identity() AS int)";
        return command;
    }  

    //---------------------------------------------------------------------------------
    // Read from the DB into a list - dataReader
    //---------------------------------------------------------------------------------
    public List<Material> getMaterials(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<Material> lm = new List<Material>();
        try {
            this.con = connect(conString); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT * FROM " + tableName;
            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            while (dr.Read())
            {   // Read till the end of the data into a row
                Material m = new Material();
                m.ID = Convert.ToInt32(dr["id"]);
                m.Name = Convert.ToString(dr["name"]);
                m.Type = Convert.ToString(dr["type"]);
                m.Cost = Convert.ToInt32(dr["cost"]);
                m.Coefficient = Convert.ToInt32 (dr["coefficient"]);
               // m.WorkCost = Convert.ToInt32(dr["workCost"]);
                //this function will return list of hobbies indexes
                //p.Hobbies = getHobbiesForPerson("TinderConnectionString", "HobbiesForUsers", p.ID);
                lm.Add(m);
            }
            return lm;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }

    //---------------------------------------------------------------------------------
    // Read from the DB into a list - dataReader
    //---------------------------------------------------------------------------------
    public List<Material> getMaterials2(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<Material> lm = new List<Material>();
        try
        {
            this.con = connect(conString); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT * FROM " + tableName;
            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            while (dr.Read())
            {   // Read till the end of the data into a row
                Material m = new Material();
                m.ID = Convert.ToInt32(dr["id"]);
                m.Name = Convert.ToString(dr["name"]);
                m.Type = Convert.ToString(dr["type"]);
            //    m.Cost = Convert.ToInt32(dr["cost"]);
                m.Coefficient = Convert.ToInt32(dr["coefficient"]);
            //    m.WorkCost = Convert.ToInt32(dr["workCost"]);
                lm.Add(m);
            }
            return lm;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }

    //---------------------------------------------------------------------------------
    // Read from the DB into a list - dataReader
    //---------------------------------------------------------------------------------
    public List<Facade> getFacades(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<Facade> lm = new List<Facade>();
        try
        {
            this.con = connect(conString); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT * FROM " + tableName;

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            while (dr.Read())
            {   // Read till the end of the data into a row
                Facade m = new Facade();
                m.ID = Convert.ToInt32(dr["id"]);
                m.Type = Convert.ToString(dr["type"]);
                m.Cost = Convert.ToInt32(dr["cost"]);
                lm.Add(m);
            }
            return lm;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }

    //--------------------------------------------------------------------------------------------------
    // This method inserts a person to the PersonTbl table 
    //--------------------------------------------------------------------------------------------------
    public int insertFacade(Facade facade)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        String cStr = BuildInsertFacadeCommand(facade);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con); // create the command  
        try
        {
            int facadeId = Convert.ToInt32(cmd.ExecuteScalar()); // execute the command
 
            return facadeId;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();// close the db connection
            }
        }
    }
    //--------------------------------------------------------------------
    // Build the Insert command String-person
    //--------------------------------------------------------------------
    private String BuildInsertFacadeCommand(Facade facade)
    {
        String command;

        StringBuilder sbFacade = new StringBuilder();
        // use a string builder to create the dynamic string
        sbFacade.AppendFormat("Values('{0}', {1})",
             facade.Type, facade.Cost);
        String prefix = "INSERT INTO materialTbl " + "(type, cost) ";
        command = prefix + sbFacade.ToString() + ";" + "SELECT CAST(scope_identity() AS int)";
        return command;

    }
    public List<Box> getBoxes(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<Box> boxesList = new List<Box>();
        try
        {
            this.con = connect(conString);
            String selectSTR = "SELECT * FROM  " + tableName; //"SELECT* FROM " + tableName + " where age >=" + filter.MinAge + " and age <=" + filter.MaxAge + "and gender = 'Male'";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row
                // read first field from the row into the list collection
                Box box = new Box();
                box.Type = Convert.ToInt32(dr["type"]);
                box.ID = Convert.ToInt32(dr["id"]);
                box.Height = Convert.ToInt32(dr["height"]);
                box.Width = Convert.ToInt32(dr["width"]);
                box.Depth = Convert.ToInt32(dr["depth"]);
                boxesList.Add(box);
            }
            return boxesList;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }

    public List<Handle> getHandles(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<Handle> handlesList = new List<Handle>();
        try
        {
            this.con = connect(conString);
            String selectSTR = "SELECT * FROM  " + tableName; //"SELECT* FROM " + tableName + " where age >=" + filter.MinAge + " and age <=" + filter.MaxAge + "and gender = 'Male'";
            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row
                // read first field from the row into the list collection
                Handle handle = new Handle();
                handle.Type = Convert.ToString(dr["type"]);
                handle.ID = Convert.ToInt32(dr["id"]);
                handle.Cost = Convert.ToInt32(dr["cost"]);

                handlesList.Add(handle);
            }
            return handlesList;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }

    public List<Hinge> getHinges(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<Hinge> hingesList = new List<Hinge>();
        try
        {
            this.con = connect(conString);
            String selectSTR = "SELECT * FROM  " + tableName; //"SELECT* FROM " + tableName + " where age >=" + filter.MinAge + " and age <=" + filter.MaxAge + "and gender = 'Male'";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row
                // read first field from the row into the list collection
                Hinge hinge = new Hinge();
                hinge.Type = Convert.ToString(dr["type"]);
                hinge.ID = Convert.ToInt32(dr["id"]);
                hinge.Cost = Convert.ToInt32(dr["cost"]);

                hingesList.Add(hinge);
            }
            return hingesList;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }

    public List<IronWork> getIronWorks(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<IronWork> ironWorksList = new List<IronWork>();
        try
        {
            this.con = connect(conString);
            String selectSTR = "SELECT * FROM  " + tableName; //"SELECT* FROM " + tableName + " where age >=" + filter.MinAge + " and age <=" + filter.MaxAge + "and gender = 'Male'";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row
                // read first field from the row into the list collection
                IronWork ironWork = new IronWork();
                ironWork.Type = Convert.ToString(dr["type"]);
                ironWork.ID = Convert.ToInt32(dr["id"]);
                ironWork.Cost = Convert.ToInt32(dr["cost"]);

                ironWorksList.Add(ironWork);
            }
            return ironWorksList;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }
    public List<Constants> getConstants(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<Constants> constantsList = new List<Constants>();
        try
        {
            this.con = connect(conString);
            String selectSTR = "SELECT * FROM  " + tableName; //"SELECT* FROM " + tableName + " where age >=" + filter.MinAge + " and age <=" + filter.MaxAge + "and gender = 'Male'";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row
                // read first field from the row into the list collection
                Constants constants = new Constants();
                constants.constantName = Convert.ToString(dr["name"]);
                constants.ID = Convert.ToInt32(dr["id"]);
                constants.Cost = Convert.ToInt32(dr["cost"]);

                constantsList.Add(constants);
            }
            return constantsList;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }
    public DBservices ReadFromDataBase(string conString, string tableName)
    {
        //SqlConnection con = null;
        try
        {
            this.con = connect(conString); // open the connection to the database/

            String selectStr = "SELECT * FROM " + tableName; // create the select that will be used by the adapter to select data from the DB

            SqlDataAdapter da = new SqlDataAdapter(selectStr, this.con); // create the data adapter

            DataSet ds = new DataSet(); // create a DataSet and give it a name (not mandatory) as defualt it will be the same name as the DB
            da.Fill(ds);                        // Fill the datatable (in the dataset), using the Select command

            DataTable dt = ds.Tables[0];
            // add the datatable and the data adapter to the dbS helper class in order to be able to save it to a Session Object
            this.dt = dt;
            this.da = da;
            return this;
        }
        catch (Exception ex)
        {
            // write to log
            throw ex;
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }
    //---------------------------------------------------------------------------------
    // update the dataset into the database
    //---------------------------------------------------------------------------------
    public void Update()
    {
        // the command build will automatically create insert/update/delete commands according to the select command
        SqlCommandBuilder builder = new SqlCommandBuilder(da);
        da.Update(dt);
    }
    private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
    {
        SqlCommand cmd = new SqlCommand(); // create the command object
        cmd.Connection = con;              // assign the connection to the command object
        cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 
        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds
        cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure
        return cmd;
    }

    //--------------------------------------------------------------------------------------------------
    // This method inserts a box to the PersonTbl table 
    //--------------------------------------------------------------------------------------------------
    public int insertBox(Box box)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)  {
            throw (ex); // write to log
        }
        String cStr = BuildInsertBoxCommand(box);      // helper method to build the insert string
        cmd = CreateCommand(cStr, con); // create the command  
        try
        {
            int boxId = Convert.ToInt32(cmd.ExecuteScalar()); // execute the command
            return boxId;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();// close the db connection
            }
        }
    }

    //--------------------------------------------------------------------
    // Build the Insert command String-person
    //--------------------------------------------------------------------
    private String BuildInsertBoxCommand(Box box)
    {
        String command;
        StringBuilder sbBox = new StringBuilder();
        // use a string builder to create the dynamic string
        sbBox.AppendFormat("Values({0}, {1} ,{2}, {3}, {4})",
            box.Type, box.Height, box.Width, box.Depth);
        String prefix = "INSERT INTO boxTbl " + "(type, height, width, depth) ";
        command = prefix + sbBox.ToString() + ";" + "SELECT CAST(scope_identity() AS int)";
        return command;
    }

    
    //update edited box in system
    public int updateBox(Box box, int Id)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex);          // write to log
        }
        String cStr = BuildUpdateCommand(box, Id);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try
        {
            int numEffected = (int)cmd.ExecuteNonQuery(); // execute the command

            return numEffected;
        }
        catch (Exception ex)
        {
            return 0;
            throw (ex);       // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();        // close the db connection
            }
        }
    }

    private string BuildUpdateCommand(Box box, int id)
    {
        string prefix = "UPDATE boxTbl SET type = '" + 1 + "', height = '" + box.Height + "', width = '" + box.Width + "',depth = '" + box.Depth + " WHERE id=" + id;
        return prefix;
    }
    //update edited Material in system
    public int updateConstants(Constants constants)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex);          // write to log
        }
        String cStr = BuildUpdateCommand(constants);      // helper method to build the insert string

        cmd = CreateCommand(cStr, this.con);             // create the command

        try
        {
            int numEffected = (int)cmd.ExecuteNonQuery(); // execute the command
            //for (int i = 0; i < material.Hobbies.Length; i++)
            //{
            //    String cStrInsertHobbies = BuildInsertHobbiesForUsersCommand(Id, person.Hobbies[i]);
            //    cmd1 = CreateCommand(cStrInsertHobbies, con);
            //    int numEffected1 = cmd1.ExecuteNonQuery();
            //}
            return numEffected;
        }
        catch (Exception ex)
        {
            return 0;
            throw (ex);       // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();        // close the db connection
            }
        }
    }

    // need to update the buildupdate command
    private string BuildUpdateCommand(Constants constants)
    {
        //String command;
        //StringBuilder sb = new StringBuilder();
        // use a string builder to create the dynamic string
        string prefix = "UPDATE constantParametersCostTbl SET boxWorkCost = '" + constants.Cost + "', cost = '" + constants.Cost/* + " WHERE id=" + id*/;//מעדכנים את כל הטבלה 
        //command = prefix + "SELECT CAST(scope_identity() AS int)";
         return prefix;
    }

    //upload Architect from DB
    public List<Architect> Read2(string conString2, string tableName2)
    {
        //SqlConnection con = null;
        List<Architect> lc = new List<Architect>();
        try
        {
            this.con = connect(conString2); // create a connection to the database using the connection String defined in the web config file

            String selectSTR = "SELECT * FROM " + tableName2;
            SqlCommand cmd = new SqlCommand(selectSTR, this.con);

            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

            while (dr.Read())
            {   // Read till the end of the data into a row
                Architect a = new Architect();
                a.arc_id = Convert.ToInt32(dr["arc_id"]);
                a.arc_name = (string)dr["arc_name"];
                lc.Add(a);
            }
            return lc;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }

        }

    }

    //Upload Supervisor from DB
    public List<Supervisor> Read(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<Supervisor> lc = new List<Supervisor>();
        try
        {
            this.con = connect(conString); // create a connection to the database using the connection String defined in the web config file

            String selectSTR = "SELECT * FROM " + tableName;
            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

            while (dr.Read())
            {   // Read till the end of the data into a row
                Supervisor s = new Supervisor();
                s.sup_id = Convert.ToInt32(dr["sup_id"]);
                s.sup_name = (string)dr["sup_name"];
                s.sup_phone = (string)dr["sup_phone"];
                lc.Add(s);
            }
            return lc;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }

    }

    //Insert customer to DB
    public int insertCust(Customer cust)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        String pStr = BuildInsertCommand(cust);      // helper method to build the insert string
        cmd = CreateCommand(pStr, this.con);             // create the command
        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            return 0;
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                // close the db connection
                this.con.Close();
            }
        }
    }

    private String BuildInsertCommand(Customer cust)
    {
        String command;       
        // use a string builder to create the dynamic string
        StringBuilder sb = new StringBuilder(); // use a string builder to create the dynamic string
        sb.AppendFormat("Values('{0}', '{1}' , '{2}', '{3}')", cust.first_name, cust.last_name, cust.phone_num,cust.email);
        String prefix = "INSERT INTO Customer2 " + "(first_name, last_name, phone_number, email) ";
        //command = prefix + sbItem.ToString();
        command = prefix + sb.ToString() + ";" + "SELECT CAST(scope_identity() AS int)";
        return command;
    }


    public List<Customer> GetCustomers()
    {
        //SqlConnection con;
        List<Customer> CustomersList = new List<Customer>();

        try
        {
            this.con = connect("PriceITConnectionString"); // create a connection to the database using the connection String defined in the web config file
        }

        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        try
        {
            String selectSTR = "SELECT * FROM Customer2 ";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);

            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row
             // read first field from the row into the list collection
                Customer customer = new Customer();
                customer.id = Convert.ToInt32(dr["id"]);
                customer.first_name = Convert.ToString(dr["first_name"]);
                customer.last_name = Convert.ToString(dr["last_name"]);
                customer.phone_num = Convert.ToString(dr["phone_number"]);
                customer.email = Convert.ToString(dr["email"]);

                CustomersList.Add(customer);
            }
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        return CustomersList;
    }

    //----------------------------------------------------------------------------
    public int Put(Customer c)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        String cStr = BuildUpdateCustomer(c);      // helper method to build the insert string

        cmd = CreateCommand(cStr, this.con);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;



        }
        catch (Exception ex)
        {

            // write to log
            throw (ex);
        }

        finally
        {
            if (this.con != null)
            {
                // close the db connection
                this.con.Close();
            }
        }
    }
    private string BuildUpdateCustomer(Customer c)
    {
        string v = "UPDATE Customer2 SET first_name='" + c.first_name + "' ,last_name='" + c.last_name + "' ,phone_number='" + c.phone_num + "' ,email='" + c.email + "' WHERE id='" + c.id + "'";
        string cmdStr = v;
        return cmdStr;

    }

    //-----------------------------------------------------
    public int DeleteCust(int custID)
    {
        //SqlConnection con;
        SqlCommand cmd;

        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex);// write to log
        }
        String cStr = BuildDeleteCust(custID);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try
        {
            int numAffected = cmd.ExecuteNonQuery(); // execute the comm
            return numAffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();// close the db connection
            }
        }

    }
    private string BuildDeleteCust(int custID)
    {
        string cmdStr = "DELETE FROM Customer2  WHERE id=" + custID + "";
        return cmdStr;
    }

    //Insert project to DB
    public int insertProject(Project proj)
    {

        //SqlConnection con;
        SqlCommand cmd;

        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        String pStr = BuildInsertProjCommand(proj);      // helper method to build the insert string

        cmd = CreateCommand(pStr, this.con);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            
            // write to log
            throw (ex);

        }

        finally
        {
            if (this.con != null)
            {
                // close the db connection
                this.con.Close();
            }
        }

    }

    private String BuildInsertProjCommand(Project proj)
    {
        String command;


        StringBuilder sb = new StringBuilder();
        // use a string builder to create the dynamic string
        sb.AppendFormat("Values('{0}', '{1}', '{2}', '{3}', '{4}', '{5}','{6}')", proj.project_name, proj.description , proj.architect, proj.supervisor , proj.customer_id , 0, proj.create_date);
        String prefix = "INSERT INTO Project2 " + "(project_name, description, architect, supervisor, custID, status, create_date) ";

        command = prefix + sb.ToString() + ";" + "SELECT CAST(scope_identity() AS int)";

        return command;
    }

    //Get projects from DB
    public List<Project> GetProjects()
    {
        //SqlConnection con;
        List<Project> ProjectsList = new List<Project>();

        try {
            this.con = connect("PriceITConnectionString"); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT * FROM Project2 ";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);

            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row          
                Project project = new Project();
                project.ID = Convert.ToInt32(dr["id"]);
                project.project_name = Convert.ToString(dr["project_name"]);
                project.create_date = Convert.ToDateTime(dr["create_date"]);
                project.description = Convert.ToString(dr["description"]);
                //project.cost = Convert.ToInt32(dr["cost"]);
                project.status = Convert.ToInt32(dr["status"]);
                project.customer_id = Convert.ToInt32(dr["custID"]);

                ProjectsList.Add(project);
            }
            return ProjectsList;
        }
        catch (Exception ex) {  // write to log
            throw (ex);
        }
        finally  {
            if (this.con != null)  {
                this.con.Close();
            }
        }
    }
    public List<Project> filterProj(Filter p)
    {

        //SqlConnection con;
        List<Project> projectList = new List<Project>();

        try
        {
            this.con = connect("PriceITConnectionString"); // create a connection to the database using the connection String defined in the web config file
        }

        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        try
        {
            String selectSTR = "SELECT * FROM Project2 where status= " +p.status+ "";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);

            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row
             // read first field from the row into the list collection
                Project project = new Project();
                project.project_name = Convert.ToString(dr["project_name"]);
                //project.create_date = Convert.ToDateTime(dr["create_date"]);
                project.description = Convert.ToString(dr["description"]);
                //project.cost = Convert.ToInt32(dr["cost"]);
                project.status = Convert.ToInt32(dr["status"]);
                project.customer_id = Convert.ToInt32(dr["custID"]);

                projectList.Add(project);
            }
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        return projectList;

    }

    public List<Project> filterProjC(Filter c)
    {

        //SqlConnection con;
        List<Project> projectList = new List<Project>();

        try
        {
            con = connect("PriceITConnectionString"); // create a connection to the database using the connection String defined in the web config file
        }

        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        try
        {
            String selectSTR = "SELECT * FROM Project2 where custID= " + c.customer_id + "";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);

            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row
             // read first field from the row into the list collection
                Project project = new Project();
                project.project_name = Convert.ToString(dr["project_name"]);
                //project.create_date = Convert.ToDateTime(dr["create_date"]);
                project.description = Convert.ToString(dr["description"]);
                //project.cost = Convert.ToInt32(dr["cost"]);
                project.status = Convert.ToInt32(dr["status"]);
                project.customer_id = Convert.ToInt32(dr["custID"]);

                projectList.Add(project);
            }
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        return projectList;

    }

    public List<Project> filterProjP(Filter p)
    {

        //SqlConnection con;
        List<Project> projectList = new List<Project>();

        try
        {
            this.con = connect("PriceITConnectionString"); // create a connection to the database using the connection String defined in the web config file
        }

        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        try
        {
            String selectSTR = "SELECT * FROM Project2 where cost>= " + p.minPrice + " and cost<= " + p.maxPrice + "";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);

            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dr.Read())
            {// Read till the end of the data into a row
             // read first field from the row into the list collection
                Project project = new Project();
                project.project_name = Convert.ToString(dr["project_name"]);
                //project.create_date = Convert.ToDateTime(dr["create_date"]);
                project.description = Convert.ToString(dr["description"]);
                //project.cost = Convert.ToInt32(dr["cost"]);
                project.status = Convert.ToInt32(dr["status"]);
                project.customer_id = Convert.ToInt32(dr["custID"]);

                projectList.Add(project);
            }
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        return projectList;

    }



    //חדש יבגני
    public List<FacadeMaterial> getFacadeMaterials(string conString, string tableName)
    {
        //SqlConnection con = null;
        List<FacadeMaterial> lm = new List<FacadeMaterial>();
        try
        {
            con = connect(conString); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT * FROM " + tableName;

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            while (dr.Read())
            {   // Read till the end of the data into a row
                FacadeMaterial m = new FacadeMaterial();
                m.ID = Convert.ToInt32(dr["id"]);
                m.Name = Convert.ToString(dr["name"]);
                m.Cost = Convert.ToInt32(dr["cost"]);

                lm.Add(m);
            }
            return lm;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }

    public int insertItem(Item item)//inserting new item
    {
        //SqlConnection con;
        SqlCommand cmd;
        try {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex) {
            // write to log
            throw (ex);
        }
        String cStr = BuildInsertItemCommand(item);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)  {
            return 0;
            // write to log
            throw (ex);
        }
        finally {
            if (this.con != null)  {
                // close the db connection
                this.con.Close();
            }
        }
    }

    //--------------------------------------------------------------------
    // Build the Insert command String
    //--------------------------------------------------------------------
    private String BuildInsertItemCommand(Item item)
    {
        String command;
        StringBuilder sbItem = new StringBuilder(); // use a string builder to create the dynamic string
        sbItem.AppendFormat("Values({0}, {1} ,'{2}', {3}, {4}, {5}, {6} ,{7}, {8}, {9}, {10}, {11}, {12}, {13}, {14}, {15}, {16}, {17}, {18}, {19}, {20}, {21}, {22}, {23}, {24}, {25}, {26}, {27}, {28})",  item.Type, item.Cost, item.ProjectID, item.BoxMaterialID, item.BoxMeasuresID, item.Partitions, item.Shelves, item.IsDistanced, item.BoxWoodDrawers, item.InternalLegraBoxDrawers, item.ExternalLegraBoxDrawers, item.InternalScalaBoxDrawers, item.ExternalScalaBoxDrawers, item.FacadeMaterialTypeID, item.FacadeTypeID, item.HingesQuantity1, item.HingesType1ID, item.HingesQuantity2, item.HingesType2ID, item.ExtraWallQuantity, item.ExtraWallTypeID, item.HandlesQuantity, item.HandlesTypeID, item.IronWorksQuantity1, item.IronWorksType1ID, item.IronWorksQuantity2, item.IronWorksType2ID, item.ExtraCostForItem);
        String prefix = "INSERT INTO itemTbl1 " + "( projectID, type, , name, cost, boxMaterialID, boxMeasuresID, partitions, shelves, isDistanced, boxWoodDrawers, internalLegraBoxDrawers, externalLegraBoxDrawers, internalScalaBoxDrawers, externalScalaBoxDrawers, facadeMaterialTypeID, facadeTypeID, hingesQuantity1, hingesType1ID, hingesQuantity2, hingesType2ID, extraWallQuantity, extraWallTypeID, handlesQuantity, handlesTypeID, ironWorksQuantity1, ironWorksType1ID, ironWorksQuantity2, ironWorksType2ID, extraCostForItem) ";
        //command = prefix + sbItem.ToString();
        command = prefix + sbItem.ToString() + ";" + "SELECT CAST(scope_identity() AS int)";
        return command;
    }

    public int insertHinge(Hinge hinge)//inserting new item
    {
        //SqlConnection con;
        SqlCommand cmd;
        try {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex) {
            // write to log
            throw (ex);
        }
        String cStr = BuildInsertHingeCommand(hinge);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try  {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex) {
            return 0;
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                // close the db connection
                this.con.Close();
            }
        }
    }

    //--------------------------------------------------------------------
    // Build the Insert command String
    //--------------------------------------------------------------------
    private String BuildInsertHingeCommand(Hinge hinge)
    {
        String command;
        StringBuilder sbItem = new StringBuilder(); // use a string builder to create the dynamic string
        sbItem.AppendFormat("Values('{0}', {1} )", hinge.Type, hinge.Cost);
        String prefix = "INSERT INTO hingeTbl " + "(type, cost) ";
        //command = prefix + sbItem.ToString();
        command = prefix + sbItem.ToString() + ";" + "SELECT CAST(scope_identity() AS int)";
        return command;
    }


    public int insertHandle(Handle handle)//inserting new item
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        String cStr = BuildInsertHandleCommand(handle);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)  {
            return 0;
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                // close the db connection
                this.con.Close();
            }
        }
    }

    //--------------------------------------------------------------------
    // Build the Insert command String
    //--------------------------------------------------------------------
    private String BuildInsertHandleCommand(Handle handle)
    {
        String command;
        StringBuilder sbItem = new StringBuilder(); // use a string builder to create the dynamic string
        sbItem.AppendFormat("Values('{0}', {1} )", handle.Type, handle.Cost);
        String prefix = "INSERT INTO handleTbl " + "(type, cost) ";
        //command = prefix + sbItem.ToString();
        command = prefix + sbItem.ToString() + ";" + "SELECT CAST(scope_identity() AS int)";
        return command;
    }


    public int insertFacadeMaterial(FacadeMaterial facadeMaterial)//inserting new item
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        String cStr = BuildInsertFacadeMaterialCommand(facadeMaterial);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            return 0;
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                // close the db connection
                this.con.Close();
            }
        }
    }

    private String BuildInsertFacadeMaterialCommand(FacadeMaterial facadeMaterial)
    {
        String command;
        StringBuilder sbItem = new StringBuilder(); // use a string builder to create the dynamic string
        sbItem.AppendFormat("Values('{0}', {1} )", facadeMaterial.Name, facadeMaterial.Cost);
        String prefix = "INSERT INTO facadeMaterialTbl " + "(type, cost) ";
        command = prefix + sbItem.ToString() + ";" + "SELECT CAST(scope_identity() AS int)";
        return command;
    }

    //update edited item in system
    public int updateItem(Item item, int Id)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex) {
            throw (ex);          // write to log
        }
        String cStr = BuildUpdateCommand(item, Id);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command

        try {
            int numEffected = (int)cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex) {
            return 0;
            throw (ex);       // write to log
        }
        finally {
            if (this.con != null) {
                this.con.Close();        // close the db connection
            }
        }
    }

    private string BuildUpdateCommand(Item p, int id) {
        //String command;
        string prefix = "UPDATE itemTbl1 SET projectID = '" + p.ProjectID + "', type = '" + p.Type + "', name = '" + p.Name + "',  cost = '" + p.Cost + "', boxMaterialID = '" + p.BoxMaterialID + "', boxMeasuresID = '" + p.BoxMeasuresID + "', partitions = '" + p.Partitions + "', shelves = '" + p.Shelves + "',   isDistanced = '" + p.IsDistanced + "', boxWoodDrawers = '" + p.BoxWoodDrawers + "', internalLegraBoxDrawers = '" + p.InternalLegraBoxDrawers +"', externalLegraBoxDrawers = '" + p.ExternalLegraBoxDrawers + "', internalScalaBoxDrawers = '" + p.InternalScalaBoxDrawers + "', externalScalaBoxDrawers = '" + p.ExternalScalaBoxDrawers + "', facadeMaterialTypeID = '" + p.FacadeMaterialTypeID + "', facadeTypeID = '" +p.FacadeTypeID +"', hingesQuantity1 = '" + p.HingesQuantity1 + "', hingesType1ID = '" + p.HingesType1ID + "', hingesQuantity2 = '" + p.HingesQuantity2 + "', hingesType2ID = '" + p.HingesType2ID + "', extraWallQuantity = '" + p.ExtraWallQuantity + "', extraWallTypeID = '" +p.ExtraWallTypeID + "', handlesQuantity = '" + p.HandlesQuantity + "', handlesTypeID = '" + p.HandlesTypeID + "', ironWorksQuantity1 = '" + p.IronWorksQuantity1 + "', ironWorksType1ID = '" + p.IronWorksType1ID + "', ironWorksQuantity2 = '" + p.IronWorksQuantity2 + "', ironWorksType2ID = '" + p.IronWorksType2ID + "', extraCostForItem = '" + p.ExtraCostForItem + "' WHERE id = " + id;
        return prefix; 
    }

    public int updateHinge(Hinge hinge, int Id)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try  {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)  {
            throw (ex);          // write to log
        }
        String cStr = BuildUpdateHingeCommand(hinge, Id);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command

        try  {
            int numEffected = (int)cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex) {
            return 0;
            throw (ex);       // write to log
        }
        finally  {
            if (this.con != null) {
                this.con.Close();        // close the db connection
            }
        }
    }

    private string BuildUpdateHingeCommand(Hinge p, int id)
    {
        //String command;
        string prefix = "UPDATE hingeTbl SET type = '" + p.Type + "', cost = '" + p.Cost + "' WHERE id = " + id;
        return prefix;
    }


    public int updateFacadeMaterial(FacadeMaterial facadeMaterial, int Id)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex);          // write to log
        }
        String cStr = BuildUpdateFacadeMaterialCommand(facadeMaterial, Id);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command

        try
        {
            int numEffected = (int)cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            return 0;
            throw (ex);       // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();        // close the db connection
            }
        }
    }

    private string BuildUpdateFacadeMaterialCommand(FacadeMaterial p, int id)
    {
        //String command;
        string prefix = "UPDATE facadeMaterialTbl SET type = '" + p.Name + "', cost = '" + p.Cost + "' WHERE id = " + id;
        return prefix;
    }


    public int updateHandle(Handle handle, int Id)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex);          // write to log
        }
        String cStr = BuildUpdateHandleCommand(handle, Id);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command

        try
        {
            int numEffected = (int)cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            return 0;
            throw (ex);       // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();        // close the db connection
            }
        }
    }

    private string BuildUpdateHandleCommand(Handle p, int id)
    {
        //String command;
        string prefix = "UPDATE handleTbl SET type = '" + p.Type + "', cost = '" + p.Cost + "' WHERE id = " + id;
        return prefix;
    }
    //update edited item in system
    public int updateProject(Project project, int Id)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex) {
            throw (ex);          // write to log
        }
        String cStr = BuildUpdateProjectCommand(project, Id);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command

        try
        {
            int numEffected = (int)cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)
        {
            return 0;
            throw (ex);       // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();        // close the db connection
            }
        }
    }


    private string BuildUpdateProjectCommand(Project p, int id)
    {
        //String command;
        string prefix = "UPDATE Project2 SET project_name = '" + p.project_name + "', description = '" + p.description + "',  create_date = '" + p.create_date + "', status = '" + p.status + "', architect = '" + p.architect + "', supervisor = '" + p.supervisor + "', cost = '" + p.cost + "' WHERE id = " + id;
        return prefix;
    }


    public int updateMaterial(Material material, int Id)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try  {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex) {
            throw (ex);          // write to log
        }
        String cStr = BuildUpdateMaterialCommand(material, Id);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command

        try {
            int numEffected = (int)cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex)  {
            return 0;
            throw (ex);       // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();        // close the db connection
            }
        }
    }
    private string BuildUpdateMaterialCommand(Material p, int id)
    {
        //String command;
        string prefix = "UPDATE materialTbl SET name = '" + p.Name + "', cost = '" + p.Cost + "', type = '" + p.Type + "',coefficient = '" + p.Coefficient + " WHERE id=" + id;

        return prefix;
    }






    public List<Item> getItems(string conString, string tableName, int id)   {
        //SqlConnection con = null;
        List<Item> lm = new List<Item>();
        try {
            this.con = connect(conString); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT * FROM " + tableName + " WHERE projectID = " + id;
            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            while (dr.Read())
            {   // Read till the end of the data into a row
                Item item = new Item();
                item.ID = Convert.ToInt32(dr["id"]);
                item.Name = Convert.ToString(dr["name"]);
                item.Cost = Convert.ToInt32(dr["cost"]);

                item.ProjectID = Convert.ToInt32(dr["projectID"]);
                item.Type = Convert.ToInt32(dr["type"]); //will always be 1 until we add open box

                item.BoxMaterialID = Convert.ToInt32(dr["boxMaterialID"]);
                item.BoxMeasuresID = Convert.ToInt32(dr["boxMeasuresID"]);
                item.Partitions = Convert.ToInt32(dr["partitions"]);
                item.Shelves = Convert.ToInt32(dr["shelves"]);
                item.IsDistanced = Convert.ToInt32(dr["isDistanced"]);
                item.BoxWoodDrawers = Convert.ToInt32(dr["boxWoodDrawers"]);
                item.InternalLegraBoxDrawers = Convert.ToInt32(dr["internalLegraBoxDrawers"]);
                item.ExternalLegraBoxDrawers = Convert.ToInt32(dr["externalLegraBoxDrawers"]);
                item.InternalScalaBoxDrawers = Convert.ToInt32(dr["internalScalaBoxDrawers"]);
                item.ExternalScalaBoxDrawers = Convert.ToInt32(dr["externalScalaBoxDrawers"]);
                item.FacadeMaterialTypeID = Convert.ToInt32(dr["facadeMaterialTypeID"]);
                item.FacadeTypeID = Convert.ToInt32(dr["facadeTypeID"]);
                item.HingesQuantity1 = Convert.ToInt32(dr["hingesQuantity1"]);
                item.HingesType1ID = Convert.ToInt32(dr["hingesType1ID"]);
                item.HingesQuantity2 = Convert.ToInt32(dr["hingesQuantity2"]);
                item.HingesType2ID = Convert.ToInt32(dr["hingesType2ID"]);
                item.ExtraWallQuantity = Convert.ToInt32(dr["extraWallQuantity"]);
                item.ExtraWallTypeID = Convert.ToInt32(dr["extraWallTypeID"]);
                item.HandlesQuantity = Convert.ToInt32(dr["handlesQuantity"]);
                item.HandlesTypeID = Convert.ToInt32(dr["handlesTypeID"]);
                item.IronWorksQuantity1 = Convert.ToInt32(dr["ironWorksQuantity1"]);
                item.IronWorksType1ID = Convert.ToInt32(dr["ironWorksType1ID"]);
                item.IronWorksQuantity2 = Convert.ToInt32(dr["ironWorksQuantity2"]);
                item.IronWorksType2ID = Convert.ToInt32(dr["ironWorksType2ID"]);
                item.ExtraCostForItem = Convert.ToInt32(dr["extraCostForItem"]);
                lm.Add(item);
            }
            return lm;
        }
        catch (Exception ex) {
            throw (ex); // write to log
        }
        finally {
            if (this.con != null)  {
                this.con.Close();
            }
        }
    }


    // getting specific item by project


    public Item getItem(string conString, string tableName, int projectID, int itemID) {
        //SqlConnection con = null;
        Item parit = new Item();
        try {
            this.con = connect(conString); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT * FROM " + tableName + " WHERE projectID='" + projectID + "' AND id='" + itemID + "'";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            while (dr.Read())
            {   // Read till the end of the data into a row
                Item item = new Item();
                item.ID = Convert.ToInt32(dr["id"]);
                item.Name = Convert.ToString(dr["name"]);
                item.Cost = Convert.ToInt32(dr["cost"]);

                item.ProjectID = Convert.ToInt32(dr["projectID"]);
                item.Type = Convert.ToInt32(dr["type"]); //will always be 1 until we add open box

                item.BoxMaterialID = Convert.ToInt32(dr["boxMaterialID"]);
                item.BoxMeasuresID = Convert.ToInt32(dr["boxMeasuresID"]);
                item.Partitions = Convert.ToInt32(dr["partitions"]);
                item.Shelves = Convert.ToInt32(dr["shelves"]);
                item.IsDistanced = Convert.ToInt32(dr["isDistanced"]);
                item.BoxWoodDrawers = Convert.ToInt32(dr["boxWoodDrawers"]);
                item.InternalLegraBoxDrawers = Convert.ToInt32(dr["internalLegraBoxDrawers"]);
                item.ExternalLegraBoxDrawers = Convert.ToInt32(dr["externalLegraBoxDrawers"]);
                item.InternalScalaBoxDrawers = Convert.ToInt32(dr["internalScalaBoxDrawers"]);
                item.ExternalScalaBoxDrawers = Convert.ToInt32(dr["externalScalaBoxDrawers"]);
                item.FacadeMaterialTypeID = Convert.ToInt32(dr["facadeMaterialTypeID"]);
                item.FacadeTypeID = Convert.ToInt32(dr["facadeTypeID"]);
                item.HingesQuantity1 = Convert.ToInt32(dr["hingesQuantity1"]);
                item.HingesType1ID = Convert.ToInt32(dr["hingesType1ID"]);
                item.HingesQuantity2 = Convert.ToInt32(dr["hingesQuantity2"]);
                item.HingesType2ID = Convert.ToInt32(dr["hingesType2ID"]);
                item.ExtraWallQuantity = Convert.ToInt32(dr["extraWallQuantity"]);
                item.ExtraWallTypeID = Convert.ToInt32(dr["extraWallTypeID"]);
                item.HandlesQuantity = Convert.ToInt32(dr["handlesQuantity"]);
                item.HandlesTypeID = Convert.ToInt32(dr["handlesTypeID"]);
                item.IronWorksQuantity1 = Convert.ToInt32(dr["ironWorksQuantity1"]);
                item.IronWorksType1ID = Convert.ToInt32(dr["ironWorksType1ID"]);
                item.IronWorksQuantity2 = Convert.ToInt32(dr["ironWorksQuantity2"]);
                item.IronWorksType2ID = Convert.ToInt32(dr["ironWorksType2ID"]);
                item.ExtraCostForItem = Convert.ToInt32(dr["extraCostForItem"]);

                parit = item;
            }
            return parit;
        }
        catch (Exception ex)
        {
            throw (ex); // write to log
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }
    //========================================login===================================//

    public User Exist(string conString, string tableName, int Id, string Password)
    {
        //SqlConnection con = null;
        User u = new User();
        try
        {
            this.con = connect(conString); // create a connection to the database using the connection String defined in the web config file

            String selectSTR = "SELECT * FROM " + tableName + " WHERE id='" + Id + "' AND " + "password='" + Password + "'";
            SqlCommand cmd = new SqlCommand(selectSTR, this.con);

            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

            while (dr.Read())
            {   // Read till the end of the data into a row
                u.Id = Convert.ToInt32(dr["Id"]);
                u.Name = Convert.ToString(dr["Name"]);
                u.Password= Convert.ToString(dr["Password"]);
                u.UserType = Convert.ToInt32(dr["UserType"]);
                u.Active = Convert.ToInt32(dr["Active"]);
            }

            return u;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }

        }

    }

    public int InsertUser(User u)
    {

        //SqlConnection con;
        SqlCommand cmd;

        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        String cStr = BuildInsertCommand(u);      // helper method to build the insert string

        cmd = CreateCommand(cStr, this.con);             // create the command


        try
        {
            int numAffected = cmd.ExecuteNonQuery();
            return numAffected;
        }
        catch (Exception ex)
        {
            return 0;
            // write to log
            throw (ex);
        }

        finally
        {
            if (this.con != null)
            {
                // close the db connection
                this.con.Close();
            }
        }
        
    }
    private String BuildInsertCommand(User u)
    {
        String command;

        StringBuilder sb = new StringBuilder();
        // use a string builder to create the dynamic string
        sb.AppendFormat("Values({0},'{1}',{2},{3},'{4}')", u.Id, u.Password, u.UserType, u.Active, u.Name);
        String prefix = "INSERT INTO Users" + "(id, password, UserType, Active, name)";
        command = prefix + sb.ToString();
        return command;
    }

    public List<User> GetAllUsers(string conString, string tableName)
    {

        //SqlConnection con = null;
        List<User> lu = new List<User>();
        try
        {
            this.con = connect(conString); // create a connection to the database using the connection String defined in the web config file

            String selectSTR = "SELECT * FROM " + tableName  ;
            SqlCommand cmd = new SqlCommand(selectSTR, this.con);

            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

            while (dr.Read())
            {   // Read till the end of the data into a row
                User u = new User();
                u.Id = Convert.ToInt32(dr["Id"]);
                u.Name = Convert.ToString(dr["Name"]);
                u.Password = Convert.ToString(dr["Password"]);
                u.UserType = Convert.ToInt32(dr["UserType"]);
                u.Active = Convert.ToInt32(dr["Active"]);
               
                lu.Add(u);
            }

            return lu;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();
            }
        }
    }
    public void DeleteUser(string userID)
    {

        //SqlConnection con;
        SqlCommand cmd;


        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        String cStr = BuildDeleteUser(userID);      // helper method to build the insert string

        cmd = CreateCommand(cStr, this.con);             // create the command


        try
        {
            cmd.ExecuteNonQuery(); // execute the comm


        }
        catch (Exception ex)
        {

            // write to log
            throw (ex);
        }

        finally
        {
            if (this.con != null)
            {
                // close the db connection
                this.con.Close();
            }
        }

    }
    private string BuildDeleteUser(string userID)
    {
        string cmdStr = "DELETE FROM Users  WHERE id='" + userID + "'";
        return cmdStr;
    }

    public int Put(User u)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        String cStr = BuildUpdateUser(u);      // helper method to build the insert string

        cmd = CreateCommand(cStr, this.con);             // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;



        }
        catch (Exception ex)
        {

            // write to log
            throw (ex);
        }

        finally
        {
            if (this.con != null)
            {
                // close the db connection
                this.con.Close();
            }
        }
    }
    private string BuildUpdateUser(User u)
    {
        string v = "UPDATE Users SET name='" + u.Name + "' ,password='" + u.Password + "' ,UserType='" + u.UserType + "' ,Active='" + u.Active + "' WHERE id='" + u.Id + "'";
        string cmdStr = v;
        return cmdStr;
    }

    public int deleteItem(int itemID)
    {
        //SqlConnection con;
        SqlCommand cmd;

        try  {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        { 
            throw (ex);// write to log
        }
        String cStr = BuildDeleteItem(itemID);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try {
            int numAffected = cmd.ExecuteNonQuery(); // execute the comm
            return numAffected;
        }
        catch (Exception ex) {
            // write to log
            throw (ex);
        }
        finally {
            if (this.con != null) {
                this.con.Close();// close the db connection
            }
        }

    }
    private string BuildDeleteItem(int itemID)
    {
        string cmdStr = "DELETE FROM itemTbl1  WHERE id='" + itemID + "'";
        return cmdStr;
    }

    public int deleteHinge(int hingeID)
    {
        //SqlConnection con;
        SqlCommand cmd;

        try {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)  {
            throw (ex);// write to log
        }
        String cStr = BuildDeleteHinge(hingeID);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try
        {
            int numAffected = cmd.ExecuteNonQuery(); // execute the comm
            return numAffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();// close the db connection
            }
        }

    }
    private string BuildDeleteHinge(int hingeID)
    {
        string cmdStr = "DELETE FROM hingeTbl  WHERE id='" + hingeID + "'";
        return cmdStr;
    }


    public int deleteFacadeMaterial(int facadeMaterialID)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex);// write to log
        }
        String cStr = BuildDeleteFacadeMaterial(facadeMaterialID);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try
        {
            int numAffected = cmd.ExecuteNonQuery(); // execute the comm
            return numAffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();// close the db connection
            }
        }

    }
    private string BuildDeleteFacadeMaterial(int facadeMaterialID)
    {
        string cmdStr = "DELETE FROM facadeMaterialTbl  WHERE id='" + facadeMaterialID + "'";
        return cmdStr;
    }


    public int deleteHandle(int handleID)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try
        {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex);// write to log
        }
        String cStr = BuildDeleteHandle(handleID);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try
        {
            int numAffected = cmd.ExecuteNonQuery(); // execute the comm
            return numAffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }
        finally
        {
            if (this.con != null)
            {
                this.con.Close();// close the db connection
            }
        }

    }
    private string BuildDeleteHandle(int handleID)
    {
        string cmdStr = "DELETE FROM handleTbl  WHERE id='" + handleID + "'";
        return cmdStr;
    }


    public int deleteMaterial(int materialID)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try  {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)
        {
            throw (ex);// write to log
        }
        String cStr = BuildDeleteMaterial(materialID);      // helper method to build the insert string
        cmd = CreateCommand(cStr, this.con);             // create the command
        try  {
            int numAffected = cmd.ExecuteNonQuery(); // execute the comm
            return numAffected;
        }
        catch (Exception ex)  {
            // write to log
            throw (ex);
        }
        finally  {
            if (this.con != null)
            {
                this.con.Close();// close the db connection
            }
        }

    }
    private string BuildDeleteMaterial(int materialID)
    {
        string cmdStr = "DELETE FROM materialTbl  WHERE id='" + materialID + "'";
        return cmdStr;
    }




    // fetch single project from DB
    public Project getProject(string conString, string tableName, int id)
    {
        //SqlConnection con = null;
        Project project = new Project();
        try {
            this.con = connect(conString); // create a connection to the database using the connection String defined in the web config file
            String selectSTR = "SELECT * FROM " + tableName + " WHERE id='" + id +  "'";

            SqlCommand cmd = new SqlCommand(selectSTR, this.con);
            // get a reader
            SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
            while (dr.Read())
            {   // Read till the end of the data into a row
                Project p = new Project();

                p.ID = Convert.ToInt32(dr["id"]);
                p.project_name = Convert.ToString(dr["project_name"]);
                p.description = (string)dr["description"];
                p.create_date = Convert.ToDateTime(dr["create_date"]);
                p.status = Convert.ToInt32(dr["status"]);
                p.architect = Convert.ToString(dr["architect"]);
                p.supervisor = Convert.ToString(dr["supervisor"]);
                p.cost = Convert.ToInt32(dr["cost"]);
                p.customer_id = Convert.ToInt32(dr["custID"]);                

                project = p;
            }
            return project;
        }
        catch (Exception ex) {
            throw (ex); // write to log
        }
        finally {
            if (con != null)
            {
                this.con.Close();
            }
        }
    }


    /// close / open the project
    public int SwitchActive(int isActive, int ProjectId)
    {
        //SqlConnection con;
        SqlCommand cmd;
        try {
            this.con = connect("PriceITConnectionString"); // create the connection
        }
        catch (Exception ex)  {
            throw (ex); // write to log
        }
        String cStr = "UPDATE Project2 " + "SET status= " + isActive + "where id=" + ProjectId; // helper method to build the insert string       
        cmd = CreateCommand(cStr, this.con);             // create the command
        try {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command
            return numEffected;
        }
        catch (Exception ex) {
            return 0;
            throw (ex);  // write to log
        }
        finally  {
            if (this.con != null)  {
                this.con.Close();   // close the db connection
            }
        }
    }
}